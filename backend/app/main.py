from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, document, sessions
from app.database import engine
from app import models

# Buat tabel otomatis
models.Base.metadata.create_all(bind=engine)

# Inisialisasi
app = FastAPI(
    title="Smart Learning Companion API",
    description="Backend Server untuk RAG dengan FastAPI, ChromaDB, dan Gemini API",
    version="1.0.0"
)

# Menentukan alamat frontend (React) yang diizinkan mengakses backend ini
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Memasang middleware CORS agar browser tidak memblokir request dari frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Include Routers
app.include_router(document.router)
app.include_router(chat.router)
app.include_router(sessions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Learning Companion API", "docs_url": "/docs"}