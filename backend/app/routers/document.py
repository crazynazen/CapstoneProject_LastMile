import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.rag_service import rag_service
import pypdf

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    session_id: str = Form(...)  
):
    """Endpoint untuk mengunggah file PDF/TXT dan menyimpannya ke ChromaDB."""
    if not file.filename.endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Format file harus PDF atau TXT.")
    
    try:
        text_content = ""
        # Ekstraksi PDF
        if file.filename.endswith('.pdf'):
            pdf_reader = pypdf.PdfReader(file.file)
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content += page_text + "\n"
        # Ekstraksi TXT
        else:
            content = await file.read()
            text_content = content.decode("utf-8")

        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Dokumen kosong atau tidak bisa dibaca.")

        doc_id = str(uuid.uuid4())
        
        # Memasukkan ke ChromaDB beserta session_id
        rag_service.add_document(
            doc_id=doc_id, 
            text=text_content, 
            filename=file.filename,
            session_id=session_id  
        )
        
        return {"status": "success", "filename": file.filename, "document_id": doc_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses dokumen: {str(e)}")


@router.get("")
def get_all_documents(session_id: str = None): 
    """Mengambil daftar nama file unik yang tersimpan di memori ChromaDB khusus sesi ini."""
    if not session_id:
        return {"filenames": []}
        
    try:
        # Ambil semua data dari koleksi ChromaDB
        results = rag_service.collection.get()
        metadatas = results.get("metadatas", []) if results else []
        
        if not metadatas:
            return {"filenames": []}
            
        filenames = set()
        # Sederhanakan ID sesi target untuk perbandingan yang akurat
        target_session = str(session_id).strip()

        for m in metadatas:
            if m and "session_id" in m:
                # Konversi session_id dari metadata ke string untuk memastikan kecocokan tipe data
                meta_session = str(m.get("session_id")).strip()
                
                if meta_session == target_session:
                    # Ambil nama file dari key 'filename' atau 'source'
                    fname = m.get("filename") or m.get("source")
                    if fname:
                        filenames.add(fname)
                        
        return {"filenames": list(filenames)}
        
    except Exception as e:
        print(f"Error pada get_all_documents: {str(e)}")
        return {"filenames": []}


@router.delete("/{filename}")
def delete_document(filename: str, session_id: str): 
    """Menghapus seluruh chunk dokumen berdasarkan nama file dan sesi dari ChromaDB."""
    try:
        rag_service.collection.delete(
            where={
                "$and": [
                    {"filename": filename},
                    {"session_id": session_id}
                ]
            }
        )
        return {"status": "success", "message": f"Dokumen '{filename}' berhasil dihapus dari sesi ini."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))