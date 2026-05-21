import React, { useState, useEffect } from 'react';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Registro from './views/Registro';
import AcercaDe from './views/AcercaDe';
import Layout from './components/Layout';
import Toast from './components/Toast';

export default function App() {
  // 1. Gestión de Tema Claro/Oscuro
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hd_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('hd_theme', theme);
    const rootElement = document.documentElement;
    if (theme === 'dark') {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 2. Gestión de Notificaciones (Toasts / Banderas)
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 3. Gestión de Autenticación y Sesión
  const [currentUser, setCurrentUser] = useState(() => {
    const sessionStr = localStorage.getItem('helpdesk_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        return session.user;
      } catch (e) {
        console.error('Error parseando sesión inicial:', e);
        localStorage.removeItem('helpdesk_session');
      }
    }
    return null;
  });

  const handleLoginSuccess = (user, token) => {
    localStorage.setItem('helpdesk_session', JSON.stringify({ user, token }));
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('helpdesk_session');
    setCurrentUser(null);
    setCurrentView('login');
    addToast('Sesión cerrada correctamente. Hasta luego.', 'info');
  };

  // 4. Controlador de Navegación / Vistas
  const [currentView, setCurrentView] = useState(() => {
    return currentUser ? 'dashboard' : 'login';
  });

  // Asegura que si no hay usuario, la vista sea obligatoriamente 'login'
  useEffect(() => {
    if (!currentUser) {
      setCurrentView('login');
    } else if (currentView === 'login') {
      setCurrentView('dashboard');
    }
  }, [currentUser]);

  // Renderizar la vista seleccionada
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            addToast={addToast} 
            currentUser={currentUser} 
          />
        );
      case 'registro':
        return (
          <Registro 
            addToast={addToast} 
            currentUser={currentUser}
            onViewChange={setCurrentView} 
          />
        );
      case 'acerca':
        return <AcercaDe />;
      default:
        return (
          <Dashboard 
            addToast={addToast} 
            currentUser={currentUser} 
          />
        );
    }
  };

  return (
    <>
      {/* Contenedor Flotante Global de Banderas / Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>

      {/* Renderizado de Pantallas */}
      {currentUser === null ? (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          addToast={addToast}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      ) : (
        <Layout
          currentView={currentView}
          onViewChange={setCurrentView}
          currentUser={currentUser}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          addToast={addToast}
        >
          {renderView()}
        </Layout>
      )}
    </>
  );
}
