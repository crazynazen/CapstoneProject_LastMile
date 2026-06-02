import React from 'react';

function LandingPage({ setCurrentView }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 1. Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-extrabold text-xl">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">SmartLearning<span className="text-emerald-400">.ai</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentView('chat')}
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Masuk Workspace
          </button>
          <button 
            onClick={() => setCurrentView('chat')}
            className="px-5 py-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20 rounded-lg text-sm font-bold transition-all shadow-inner"
          >
            Upload Jurnal Gratis
          </button>
        </div>
      </nav>

      {/* 2. Hero Section (Emotional Hook & Clear Identity) */}
      <main className="container mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        {/* Glow Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-700 shadow-lg">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-100">AI PDF Analyzer & Tutor Pribadi Mahasiswa</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
          Ubah Jurnal 50 Halaman <br className="hidden md:block" />
          Jadi <span className="text-emerald-400">Paham dalam 5 Menit.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Berhenti membuang waktu membaca dari awal sampai akhir. Unggah materi Anda, biarkan AI mengekstrak konsep inti, membuat peta belajar, dan menguji hafalan Anda melalui *flashcard*.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5 mb-14">
          <button 
            onClick={() => setCurrentView('chat')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1"
          >
            Coba Analisis Jurnal Sekarang
          </button>
          <p className="text-sm text-gray-500 font-medium flex items-center">
            <span className="mr-2">⚡</span> Gratis tanpa kartu kredit
          </p>
        </div>

        {/* 3. Trust Indicators */}
        <div className="border-y border-gray-800 py-6 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-sm font-semibold text-gray-500">
          <div className="flex items-center"><span className="text-emerald-500 mr-2">✔</span> Powered by RAG AI</div>
          <div className="flex items-center"><span className="text-emerald-500 mr-2">✔</span> Anti-Halusinasi Data</div>
          <div className="flex items-center"><span className="text-emerald-500 mr-2">✔</span> Dibuat untuk Pelajar</div>
        </div>
      </main>

      {/* 4. Dashboard Preview (Visual Mockup) */}
      <section className="container mx-auto px-6 mb-24">
        <div className="relative max-w-5xl mx-auto">
          {/* Floating Card: Flashcard */}
          <div className="absolute -left-6 top-10 md:-left-12 md:top-20 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-2xl z-20 w-48 md:w-64 rotate-[-6deg] animate-[bounce_8s_infinite]">
            <div className="text-xs text-purple-400 font-bold mb-2 flex items-center">✨ Flashcard Generated</div>
            <p className="text-sm font-medium text-white mb-1">Q: Apa itu Metode Tsukamoto?</p>
            <p className="text-xs text-gray-400">A: Ekstensi logika fuzzy yang menggunakan aturan IF-THEN...</p>
          </div>

          {/* Floating Card: Roadmap */}
          <div className="absolute -right-6 bottom-10 md:-right-12 md:bottom-20 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-2xl z-20 w-48 md:w-64 rotate-[4deg] animate-[bounce_10s_infinite_reverse]">
            <div className="text-xs text-blue-400 font-bold mb-2 flex items-center">🗺️ Peta Belajar</div>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-center"><span className="w-4 h-4 bg-emerald-500/20 text-emerald-400 rounded-full inline-flex justify-center items-center mr-2">1</span> Baca Abstrak</li>
              <li className="flex items-center"><span className="w-4 h-4 bg-gray-700 text-gray-400 rounded-full inline-flex justify-center items-center mr-2">2</span> Pahami Metodologi</li>
            </ul>
          </div>

          {/* Main Dashboard Window */}
          <div className="bg-gray-850/80 backdrop-blur-xl border border-gray-750 rounded-2xl shadow-2xl overflow-hidden z-10 relative">
            <div className="bg-gray-900 border-b border-gray-800 p-3 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 text-xs font-mono text-gray-500">Smart_Learning_Workspace</div>
            </div>
            <div className="p-6 md:p-10">
              <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl mb-6 max-w-2xl">
                <p className="text-sm text-emerald-300">🤖 [Sistem] Dokumen "Pengaruh_AI_terhadap_Siswa.pdf" telah dipelajari.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-xl rounded-tr-none ml-auto max-w-sm mb-6 border border-gray-700">
                <p className="text-sm text-gray-200">Tolong rangkum 3 argumen utama dari penulis di bab pembahasan.</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl rounded-tl-none mr-auto max-w-2xl border border-gray-750">
                <p className="text-sm text-gray-300 mb-2 font-medium">Tentu, berdasarkan dokumen yang Anda unggah, berikut adalah 3 argumen utamanya:</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>1. <strong className="text-gray-200">Efisiensi Waktu:</strong> AI mempercepat pencarian referensi hingga 60%...</p>
                  <p>2. <strong className="text-gray-200">Personalisasi:</strong> Gaya belajar dapat disesuaikan...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Alur Penggunaan (How it Works) */}
      <section className="container mx-auto px-6 py-20 border-t border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cara Kerja yang Sangat Mudah</h2>
          <p className="text-gray-400">Tidak perlu prompt yang rumit. Sistem kami yang melakukan pekerjaan beratnya.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-gray-800 via-emerald-500/30 to-gray-800 -z-10"></div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-400 mx-auto mb-6 shadow-lg">1</div>
            <h3 className="text-xl font-bold text-white mb-2">Unggah Materi</h3>
            <p className="text-gray-400 text-sm">Upload file PDF jurnal, buku, atau slide presentasi Anda ke dalam *workspace*.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 border-2 border-emerald-500/50 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-400 mx-auto mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">2</div>
            <h3 className="text-xl font-bold text-white mb-2">AI Menganalisis</h3>
            <p className="text-gray-400 text-sm">Teknologi Vector Database akan membaca, memahami, dan menyimpan konteks dokumen Anda.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-400 mx-auto mb-6 shadow-lg">3</div>
            <h3 className="text-xl font-bold text-white mb-2">Tanya & Kuasai</h3>
            <p className="text-gray-400 text-sm">Gunakan tombol 1-klik untuk *Flashcard*, *Roadmap*, atau mulai interaksi tanya jawab mendalam.</p>
          </div>
        </div>
      </section>

      {/* 6. Feature List (Benefit-Oriented) */}
      <section className="bg-gray-850 py-24 border-y border-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Mengapa AI Generik Saja Tidak Cukup?</h2>
            <p className="text-gray-400">ChatGPT biasa tidak membaca dokumen Anda secara spesifik. Kami mengatasi celah tersebut.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">100% Fokus Pada Dokumen (Anti-Ngarang)</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Sistem kami dibangun menggunakan arsitektur *Retrieval-Augmented Generation* (RAG). AI diwajibkan mencari jawaban HANYA dari file PDF yang Anda unggah, menekan risiko informasi palsu (halusinasi) hingga mendekati nol.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-white mb-3">Memori Sesi yang Terisolasi</h3>
              <p className="text-gray-400 leading-relaxed text-sm">Belajar AI di ruang A, belajar Jaringan di ruang B. Konteks tidak akan pernah tumpang tindih berkat teknologi Vector Database kami yang canggih.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="container mx-auto px-6 py-24 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Pertanyaan yang Sering Diajukan</h2>
        <div className="space-y-4">
          <div className="bg-gray-850 p-6 rounded-xl border border-gray-800">
            <h3 className="font-bold text-white mb-2">Apakah data PDF saya aman?</h3>
            <p className="text-sm text-gray-400">Tentu. Dokumen yang Anda unggah hanya diproses untuk sesi belajar Anda saat itu dan Anda bisa menghapus riwayat ruang obrolan secara permanen kapan saja.</p>
          </div>
          <div className="bg-gray-850 p-6 rounded-xl border border-gray-800">
            <h3 className="font-bold text-white mb-2">Berapa ukuran maksimal dokumen?</h3>
            <p className="text-sm text-gray-400">Saat ini Anda dapat mengunggah file PDF dan TXT. Sistem pemecah teks (*text splitter*) kami mampu menangani jurnal belasan hingga puluhan halaman sekaligus.</p>
          </div>
          <div className="bg-gray-850 p-6 rounded-xl border border-gray-800">
            <h3 className="font-bold text-white mb-2">Apakah bisa membuat pertanyaan dari materi?</h3>
            <p className="text-sm text-gray-400">Sangat bisa! Anda cukup menekan tombol "✨ Flashcard" di dalam ruang obrolan, dan AI akan otomatis mengekstrak poin-poin penting menjadi tabel pertanyaan dan jawaban.</p>
          </div>
        </div>
      </section>

      {/* 8. Final Call to Action */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-emerald-900/20 -z-10"></div>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">Siap Menguasai Materi untuk Sidang Besok?</h2>
          <p className="text-xl text-emerald-100/70 mb-10 max-w-2xl mx-auto">Jangan biarkan tumpukan PDF memperlambat kelulusan Anda. Biarkan AI membantu Anda mencerna informasi sekarang juga.</p>
          <button 
            onClick={() => setCurrentView('chat')}
            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 rounded-full font-black text-xl transition-transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            Mulai Upload PDF Sekarang &rarr;
          </button>
        </div>
      </section>

      {/* 9. Professional Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 pt-12 pb-8">
        <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-bold text-white">SmartLearning<span className="text-emerald-500">.ai</span></span>
            <p className="text-sm text-gray-500 mt-2">Ditenagai oleh RAG, ChromaDB & Gemini Pro.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500 font-medium">
            <button onClick={() => setCurrentView('chat')} className="hover:text-emerald-400 transition-colors">Workspace</button>
            <a href="#fitur" className="hover:text-emerald-400 transition-colors">Fitur</a>
            <span className="cursor-not-allowed">Privasi (Demo)</span>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8 pt-8 border-t border-gray-800/50 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Smart Learning Companion Project. Designed for Educational Purposes.
        </div>
      </footer>
      
    </div>
  );
}

export default LandingPage;