import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatbotPage({ setCurrentView }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [documents, setDocuments] = useState([]);
  
  const messagesEndRef = useRef(null);

  // 1. Load Daftar Sesi saat Halaman Pertama Dibuka
  useEffect(() => {
    fetchSessions();
  }, []);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Fetch Daftar Sesi dari SQLite Backend
  const fetchSessions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sessions/');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        
        // Jika belum ada sesi aktif, tapi ada data sesi, pilih sesi teratas
        if (!activeSessionId && data.length > 0) {
          switchSession(data[0].id);
        } else if (data.length === 0) {
          // Jika kosong, buat sesi default baru
          handleCreateNewSession();
        }
      }
    } catch (error) {
      console.error("Gagal mengambil daftar sesi:", error);
    }
  };

  // 3. Membuat Sesi Baru
  const handleCreateNewSession = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sessions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Sesi Belajar ${new Date().toLocaleTimeString()}` })
      });
      if (response.ok) {
        const newSession = await response.json();
        setSessions(prev => [newSession, ...prev]);
        switchSession(newSession.id);
      }
    } catch (error) {
      console.error("Gagal membuat sesi baru:", error);
    }
  };

  // 4. Berpindah Ruang Obrolan
  const switchSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    setDocuments([]);
    setUploadStatus("");
    
    // Ambil Riwayat Chat Khusus Sesi Ini
    try {
      const chatRes = await fetch(`http://127.0.0.1:8000/sessions/${sessionId}/history`);
      if (chatRes.ok) {
        const historyData = await chatRes.json();
        // Format agar sesuai dengan state React kita
        const formattedHistory = historyData.map(msg => ({
          text: msg.content,
          isAi: msg.role === 'ai'
        }));
        setMessages(formattedHistory.length > 0 ? formattedHistory : [{ text: "Halo! Saya Tutor Pribadi AI Anda. Unggah dokumen materi untuk sesi ini, lalu tanyakan apa saja kepada saya.", isAi: true }]);
      }
      
      // Ambil Daftar Dokumen Khusus Sesi Ini
      const docRes = await fetch(`http://127.0.0.1:8000/documents?session_id=${sessionId}`);
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData.filenames || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data sesi:", error);
    }
  };

  // 4.5 Fungsi Menghapus Sesi Chat (BARU)
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Mencegah klik tombol Hapus memicu klik buka Sesi
    
    if (!window.confirm("Apakah Anda yakin ingin menghapus histori obrolan ini secara permanen?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Hapus sesi dari state daftar sidebar
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(updatedSessions);
        
        // Logika cerdas: Jika chat yang dihapus adalah chat yang sedang dibuka-
        if (activeSessionId === sessionId) {
          if (updatedSessions.length > 0) {
            // otomatis pindah ke chat teratas yang tersisa
            switchSession(updatedSessions[0].id);
          } else {
            // atau bersihkan layar jika semua chat sudah habis
            setActiveSessionId(null);
            setMessages([]);
            setDocuments([]);
          }
        }
      }
    } catch (error) {
      alert("Gagal menghapus sesi. Periksa koneksi backend.");
    }
  };

  // 5. Fungsi Mengirim Pesan Chat
  const handleSendMessage = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const userMessage = customPrompt || input;
    if (!userMessage.trim() || loading || !activeSessionId) return;

    const displayMessage = customPrompt ? `🤖 [Sistem Aksi] Menjalankan perintah otomatis...` : userMessage;

    setMessages(prev => [...prev, { text: displayMessage, isAi: false }, { text: "", isAi: true }]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, session_id: activeSessionId }),
      });
      
      if (!response.ok) throw new Error("Gagal merespons dari server");
      setLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiFullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(value, { stream: true });
        aiFullText += chunkText;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = aiFullText;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = "Maaf, gagal terhubung ke server. Pastikan API Key valid dan backend menyala.";
        return newMessages;
      });
      setLoading(false);
    }
  };

  // 6. Fungsi Mengunggah Dokumen PDF
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!file || !activeSessionId) {
      setUploadStatus("Silahkan pilih file terlebih dahulu.");
      return;
    }
    setUploadStatus("Sedang memproses dokumen...");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("session_id", activeSessionId);

    try {
      const response = await fetch('http://127.0.0.1:8000/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`Sukses mengekstrak dokumen.`);
        setFile(null);
        e.target.reset();
        
        await switchSession(activeSessionId);
        
        setMessages(prev => [...prev, { text: `[Sistem] Dokumen "${data.filename}" telah dipelajari oleh AI untuk Sesi ini.`, isAi: true }]);
      } else {
        setUploadStatus(`Gagal: ${data.detail || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      setUploadStatus("Gagal terhubung ke server untuk upload.");
    }
  };

  // 7. Fungsi Hapus Dokumen
  const handleDeleteDocument = async (filename) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${filename}" dari sesi ini?`)) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/documents/${encodeURIComponent(filename)}?session_id=${activeSessionId}`, { method: 'DELETE' });
      if (response.ok) {
        setMessages(prev => [...prev, { text: `[Sistem] Dokumen "${filename}" berhasil dihapus dari sesi ini.`, isAi: true }]);
        // Refresh list
        const docRes = await fetch(`http://127.0.0.1:8000/documents?session_id=${activeSessionId}`);
        if (docRes.ok) {
          const docData = await docRes.json();
          setDocuments(docData.filenames || []);
        }
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      
      {/* Sisi Kiri: Panel Sidebar Multi-Sesi */}
      <div className="w-80 bg-gray-850 flex flex-col border-r border-gray-700 h-full shadow-2xl z-10 relative">
        <div className="p-5 border-b border-gray-750">
           <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center text-xs text-gray-400 hover:text-emerald-400 transition-colors mb-4"
          >
            ← Beranda Utama
          </button>
          
          <button 
            onClick={handleCreateNewSession}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 py-3 px-4 rounded-xl transition-all font-semibold text-sm shadow-inner group"
          >
            <span className="text-lg group-hover:scale-125 transition-transform">+</span> 
            <span>Chat Baru</span>
          </button>
        </div>

        {/* Daftar Sesi Chat (Scrollable) - DIMODIFIKASI UNTUK TOMBOL HAPUS */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions.map(session => (
            <div key={session.id} className="relative group flex items-center">
              
              {/* Tombol Utama (Klik untuk masuk ruang) */}
              <button
                onClick={() => switchSession(session.id)}
                className={`w-full text-left p-3 pr-10 rounded-xl text-sm transition-all flex items-center truncate ${
                  activeSessionId === session.id 
                    ? 'bg-gray-750 border-l-4 border-emerald-500 text-white font-medium shadow-md' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-l-4 border-transparent'
                }`}
              >
                <span className="truncate">💬 {session.title}</span>
              </button>

              {/* Tombol Hapus (Muncul saat di-hover) */}
              <button
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="absolute right-2 opacity-0 group-hover:opacity-100 p-2 text-red-500/70 hover:text-red-400 hover:scale-110 transition-all z-20"
                title="Hapus Histori"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sisi Kanan: Ruang RAG & Obrolan Aktif */}
      <div className="flex-1 flex flex-col bg-gray-800">
        
        {/* Header Ruang Chat */}
        <div className="p-4 bg-gray-900 border-b border-gray-750 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-sm font-semibold text-gray-200">
              {sessions.find(s => s.id === activeSessionId)?.title || "Memuat Ruang Belajar..."}
            </span>
          </div>
          
          {/* Info Dokumen Aktif (Mini) */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-500 font-medium">Dokumen Aktif:</span>
            <span className="bg-gray-850 text-emerald-400 px-3 py-1 rounded-full border border-gray-700">
            {documents.length > 0 ? documents.length : (messages.some(m => m.text.includes("[Sistem] Dokumen")) ? 1 : 0)} File
            </span>
          </div>
        </div>

        {/* Area Pesan Chat */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.isAi 
                    ? 'bg-gray-850 text-gray-200 rounded-tl-none border border-gray-750 prose prose-invert prose-sm' 
                    : 'bg-emerald-700 text-white rounded-tr-none shadow-emerald-900/20'
                }`}>
                {msg.isAi ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-850 text-gray-400 p-4 rounded-2xl rounded-tl-none border border-gray-750 text-sm flex items-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Panel Kontrol Bawah (Upload, Quick Actions, & Input) */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex flex-col space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-10">
          
          {/* Baris Atas Kontrol: Unggah PDF & Tombol Aksi */}
          <div className="flex space-x-3 items-center">
             {/* Kotak Upload Kecil */}
            <form onSubmit={handleUploadDocument} className="flex flex-1 items-center bg-gray-850 p-1.5 rounded-xl border border-gray-750 max-w-xs">
              <input 
                type="file" 
                accept=".pdf,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-750 file:text-gray-300 hover:file:bg-gray-700 cursor-pointer"
              />
              <button type="submit" className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white transition disabled:opacity-50" disabled={!file || loading}>
                Unggah
              </button>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-1 space-x-2 justify-end">
              <button
                type="button"
                disabled={loading || (documents.length === 0 && !messages.some(m => m.text.includes("[Sistem] Dokumen")))}
                onClick={() => handleSendMessage(null, "Berdasarkan dokumen materi di sesi ini, buatkan daftar pertanyaan penting (Flashcards) dalam bentuk TABEL MARKDOWN (No, Pertanyaan, Kunci Jawaban).")}
                className="py-2 px-4 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center shadow-inner"
              >
                ✨ Flashcard
              </button>
              <button
                type="button"
                disabled={loading || (documents.length === 0 && !messages.some(m => m.text.includes("[Sistem] Dokumen")))}
                onClick={() => handleSendMessage(null, "Buatkan saya Peta Belajar (Roadmap) langkah-demi-langkah yang terstruktur berdasarkan materi jurnal di sesi ini.")}
                className="py-2 px-4 bg-blue-900/30 hover:bg-blue-800/40 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center shadow-inner"
              >
                🗺️ Peta Belajar
              </button>
            </div>
          </div>
          
          {/* Baris Bawah: Input Chat Utama */}
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan materi, ringkasan jurnal, atau rumus..." 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-gray-100 placeholder-gray-500 shadow-inner"
            />
            <button type="submit" disabled={loading} className="px-8 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 rounded-xl text-sm font-bold transition text-white shadow-lg shadow-emerald-900/30">
              Kirim
            </button>
          </form>

          {uploadStatus && (
            <p className="text-xs text-center text-emerald-400 absolute bottom-2 left-0 right-0">{uploadStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;