import os
from dotenv import load_dotenv

# Menentukan jalur absolut ke file backend/.env secara konsisten
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    CHROMA_DB_PATH: str = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    PORT: int = int(os.getenv("PORT", 8000))

settings = Settings()