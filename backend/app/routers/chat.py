from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app import models
from app.services.rag_service import rag_service
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default_user" 

@router.post("")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    session_id = request.session_id
    user_message = request.message

    print(f"\n📩 USER MESSAGES: '{user_message}'")

    # 1. Tarik riwayat percakapan lama dari Database SQLite (6 pesan terakhir)
    recent_history = db.query(models.ChatMessage).filter(
        models.ChatMessage.session_id == session_id
    ).order_by(models.ChatMessage.created_at.desc()).limit(6).all()
    
    # Balik urutannya agar kronologis (dari yang terlama ke terbaru)
    recent_history.reverse()

    history_context = ""
    if recent_history:
        history_context = "\n".join([
            f"{'User' if msg.role == 'user' else 'AI'}: {msg.content}"
            for msg in recent_history
        ])

    # 2. Simpan pesan baru pengguna ke Database SQLite
    new_user_msg = models.ChatMessage(session_id=session_id, role="user", content=user_message)
    db.add(new_user_msg)
    db.commit()

    # 3. Ambil konteks dari ChromaDB KHUSUS SESI INI SAJA
    
    context = rag_service.query_context(query_text=user_message, session_id=session_id, n_results=4)
    print(f"📚 CONTEXT FOUND: {len(context)} karakter teks ditarik untuk sesi {session_id}.")
    
    # 4. Susun Prompt
    # 4. Susun Prompt
    rag_prompt = f"""
Anda adalah Tutor Pribadi AI yang cerdas dan interaktif. Prioritaskan menjawab pertanyaan secara akurat berdasarkan [KONTEKS MATERI].
Gunakan data dari [RIWAYAT PERCAKAPAN] jika pengguna merujuk ke topik sebelumnya.

ATURAN PENTING:
1. Jika informasi tersedia di [KONTEKS MATERI], gunakan data tersebut sebagai acuan utama Anda.
2. Jika jawaban TIDAK ADA di dalam [KONTEKS MATERI], Anda DIIZINKAN menggunakan pengetahuan umum Anda untuk menjawab dan membantu proses belajar pengguna secara luas.
3. Jika Anda menjawab menggunakan pengetahuan umum, Anda WAJIB memberikan catatan atau tanda singkat di akhir jawaban bahwa informasi tersebut berasal dari luar dokumen (contoh: "*Catatan: Jawaban ini berdasarkan pengetahuan umum di luar materi dokumen.*").

[KONTEKS MATERI]
{context}

[RIWAYAT PERCAKAPAN]
{history_context if history_context else "Belum ada percakapan."}

Pertanyaan Baru Pengguna: {user_message}
Jawaban Anda:
"""

    # 5. Fungsi Generator untuk Streaming
    def event_generator():
        full_response = ""
        try:
            # Panggil fungsi streaming
            for chunk in gemini_service.generate_answer_stream(rag_prompt):
                full_response += chunk
                yield chunk # Kirim potongan teks langsung ke frontend
        except Exception as e:
            error_msg = f"\n[Error Sistem]: {str(e)}"
            full_response += error_msg
            yield error_msg
        finally:
            # 6. Simpan jawaban AI ke Database SQLite setelah streaming selesai
            # Menggunakan SessionLocal baru agar aman di dalam thread generator
            db_session = SessionLocal()
            try:
                ai_msg = models.ChatMessage(session_id=session_id, role="ai", content=full_response)
                db_session.add(ai_msg)
                db_session.commit()
                print(f"🤖 STREAM SELESAI & TERSIMPAN. Total Panjang: {len(full_response)} karakter.\n")
            finally:
                db_session.close()

    # 7. Kembalikan response sebagai Stream teks
    return StreamingResponse(event_generator(), media_type="text/plain")

@router.post("/reset")
def reset_chat(request: dict, db: Session = Depends(get_db)):
    """Menghapus riwayat chat hanya untuk sesi yang dipilih dari database."""
    session_id = request.get("session_id", "default_user")
    
    # Hapus pesan dari SQLite berdasarkan session_id
    db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).delete()
    db.commit()
    
    return {"status": "success", "message": f"Riwayat chat untuk {session_id} berhasil dihapus dari database."}