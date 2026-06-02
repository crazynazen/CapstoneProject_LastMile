from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    # ID unik untuk setiap ruang chat
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    title = Column(String, default="Sesi Analisis Baru")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relasi: 1 Sesi memiliki banyak Pesan
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"))
    role = Column(String) # Berisi 'user' atau 'ai'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relasi balik ke tabel Sesi
    session = relationship("ChatSession", back_populates="messages")