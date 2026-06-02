from rich import text

from app.database import get_chroma_client
from app.services.gemini_service import gemini_service

chroma_client = get_chroma_client()
# Membuat atau memuat koleksi data di ChromaDB
collection = chroma_client.get_or_create_collection(name="smart_learning_collection")

class RAGService:
    def split_text(self, text: str, chunk_size: int = 600, chunk_overlap: int = 60) -> list[str]:
        """Memecah teks panjang menjadi potongan kecil agar muat dalam konteks LLM."""
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - chunk_overlap
        return chunks

    # Tambahkan parameter session_id di sini
    def add_document(self, doc_id: str, text: str, filename: str, session_id: str): 
        """Proses Ingestion: Pecah dokumen, buat embedding, dan simpan ke ChromaDB."""
        chunks = self.split_text(text)
    
        for i, chunk in enumerate(chunks):
            unique_id = f"{doc_id}_chunk_{i}"
            # Generate embedding menggunakan service Gemini
            vector = gemini_service.get_embedding(chunk)
        
            # Simpan ke database vektor
            collection.add(
            ids=[unique_id],
            embeddings=[vector],
            documents=[chunk],
            # Sisipkan session_id ke dalam metadatas
            metadatas=[{"filename": filename, "chunk_index": i, "session_id": session_id}] 
        )

    def query_context(self, query_text: str, session_id: str, n_results: int = 4):
        """Proses Retrieval: Mencari potongan teks yang paling mirip dengan pertanyaan user."""
        try:
            query_vector = gemini_service.get_embedding(query_text)
            
            results = collection.query(
                query_embeddings=[query_vector],
                n_results=n_results,
                where={"session_id": session_id}
            )
            
            # Ambil dokumen teks hasil pencarian
            documents = results.get("documents", [[]])[0]
            if not documents:
                return ""
                
            return "\n\n".join(documents)
        except Exception:
            return ""

rag_service = RAGService()