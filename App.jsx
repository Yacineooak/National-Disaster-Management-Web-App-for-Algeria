import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

// Composants
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import IncidentForm from './components/IncidentForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';

// Hooks et services
import { useAuth } from './hooks/useAuth.jsx';
import { useNotifications } from './hooks/useNotifications.jsx';
import { AuthProvider } from './contexts/AuthContext.js';
import { NotificationProvider } from './contexts/NotificationContext.js';

function AppContent() {
  const { user, loading } = useAuth();
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onReportIncident={() => setShowIncidentForm(true)} />
      
      <main className="pt-16">
        <Routes>
          <Route 
            path="/" 
            element={
              <MapView 
                onReportIncident={() => setShowIncidentForm(true)}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/profile" 
            element={
              user ? <Profile /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/login" 
            element={
              !user ? <Login /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/register" 
            element={
              !user ? <Register /> : <Navigate to="/" replace />
            } 
          />
        </Routes>
      </main>

      {/* Formulaire de rapport d'incident */}
      {showIncidentForm && (
        <IncidentForm 
          isOpen={showIncidentForm}
          onClose={() => setShowIncidentForm(false)}
        />
      )}

      {/* Notifications toast */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={5000}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
