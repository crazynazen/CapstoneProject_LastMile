from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from fastapi import HTTPException
from app.services.rag_service import rag_service

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.post("/", response_model=schemas.SessionResponse)
def create_session(session: schemas.SessionCreate, db: Session = Depends(get_db)):
    # Membuat ruang chat/sesi baru
    new_session = models.ChatSession(title=session.title)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.get("/", response_model=list[schemas.SessionResponse])
def get_all_sessions(db: Session = Depends(get_db)):
    # Mengambil semua daftar sesi untuk di-render di Sidebar (diurutkan dari yang terbaru)
    return db.query(models.ChatSession).order_by(models.ChatSession.created_at.desc()).all()

@router.get("/{session_id}/history", response_model=list[schemas.MessageResponse])
def get_session_history(session_id: str, db: Session = Depends(get_db)):
    # Mengambil riwayat chat masa lalu berdasarkan ID Sesi tertentu
    return db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.created_at.asc()).all()

@router.delete("/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Endpoint untuk menghapus sesi chat, riwayat pesan, dan memori dokumennya."""
    
    # 1. Cek apakah sesi ada di database
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    
    if session:
        # 2. Hapus semua riwayat pesan dari tabel ChatMessage (SQLite)
        db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).delete()
        
        # 3. Hapus profil sesi dari tabel ChatSession (SQLite)
        db.delete(session)
        db.commit()
        
        # 4. Bersihkan memori dokumen AI di ChromaDB khusus sesi ini
        try:
            rag_service.collection.delete(where={"session_id": session_id})
        except Exception as e:
            print(f"Catatan ChromaDB: {e}") # Abaikan jika belum ada dokumen yang diunggah
            
        return {"status": "success", "message": "Ruang obrolan berhasil dihapus."}
        
    raise HTTPException(status_code=404, detail="Sesi tidak ditemukan.")