import chromadb
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# 1. KONFIGURASI DATABASE RELASIONAL (SQLITE)
# Untuk menyimpan Riwayat Chat & Sesi
SQLALCHEMY_DATABASE_URL = "sqlite:///./smart_learning.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 2. KONFIGURASI DATABASE VEKTOR (CHROMADB)
# Untuk menyimpan Ekstraksi Dokumen PDF (RAG)
# Inisialisasi database lokal ChromaDB secara persistent
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)

def get_chroma_client():
    return chroma_client