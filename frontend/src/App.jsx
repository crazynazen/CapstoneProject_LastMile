import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import ChatbotPage from './components/ChatbotPage.jsx';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchUploadedDocuments();
  }, []);

  const fetchUploadedDocuments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.filenames || []);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar dokumen:", error);
    }
  };

  // Conditional Rendering berdasarkan state currentView
  if (currentView === 'dashboard') {
    return (
      <LandingPage 
        setCurrentView={setCurrentView} 
        documentsCount={documents.length} 
      />
    );
  }

  return (
    <ChatbotPage 
      setCurrentView={setCurrentView} 
      documents={documents} 
      fetchUploadedDocuments={fetchUploadedDocuments}
    />
  );
}

export default App;