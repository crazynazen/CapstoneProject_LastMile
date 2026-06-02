import os
from google import genai
from app.config import settings

class GeminiService:
    def __init__(self):
        # Inisialisasi Client resmi google-genai
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
            http_options={'api_version': 'v1'}
        )
        
        # Model utama untuk fitur Chat / Penalaran teks
        self.chat_model = "gemini-2.5-flash"
        
        print("\n================= GEMINI MODELS DETECTION =================")
        print("Mencari daftar model yang aktif untuk API Key Anda...")
        
        available_models = []
        try:
            # Menggunakan .list() sesuai standarisasi SDK google-genai baru
            for model in self.client.models.list():
                clean_name = model.name.replace("models/", "")
                available_models.append(clean_name)
                print(f"  -> {clean_name}")
            
            # Memfilter model khusus yang mendukung embedding
            embedding_options = [m for m in available_models if "embed" in m.lower()]
            
            if "text-embedding-004" in embedding_options:
                self.embed_model = "text-embedding-004"
            elif len(embedding_options) > 0:
                self.embed_model = embedding_options[0]
            else:
                self.embed_model = "text-embedding-004"
                
            print(f"\n👉 SISTEM OTOMATIS MEMILIH EMBED MODEL: {self.embed_model}")
            print("===========================================================\n")
            
        except Exception as e:
            print(f"⚠️ Gagal mendeteksi model: {str(e)}")
            self.embed_model = "text-embedding-004"
            print(f"👉 Menggunakan Fallback: {self.embed_model}\n")

    def generate_answer(self, prompt: str) -> str:
        """Menghasilkan teks respons dari Gemini berdasarkan prompt."""
        try:
            response = self.client.models.generate_content(
                model=self.chat_model,
                contents=prompt,
            )
            return response.text
        except Exception as e:
            return f"Error generating content: {str(e)}"
        
    def generate_answer_stream(self, prompt: str):
        """Menghasilkan teks respons dari Gemini secara streaming (per kata)."""
        try:
            response = self.client.models.generate_content_stream(
                model=self.chat_model,
                contents=prompt,
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"\n[Error API: {str(e)}]"

    def get_embedding(self, text: str) -> list[float]:
        """Mengubah teks materi menjadi vektor embedding."""
        try:
            response = self.client.models.embed_content(
                model=self.embed_model,
                contents=text
            )
            return response.embeddings[0].values
        except Exception as e:
            raise RuntimeError(f"Error generating embedding [{self.embed_model}]: {str(e)}")

# Inisialisasi service untuk digunakan oleh komponen lain
gemini_service = GeminiService()