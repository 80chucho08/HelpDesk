import React, { useState } from 'react';
import { apiService } from '../services/api';

/**
 * MasterPage / Plantilla Principal (Layout).
 * Encapsula la cabecera, la barra de navegación lateral y el contenido dinámico.
 */
export default function Layout({ 
  children, 
  currentView, 
  onViewChange, 
  currentUser, 
  onLogout,
  theme,
  toggleTheme,
  addToast
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(apiService.isDemoMode());

  // Alternar Modo de Simulación
  const handleToggleDemoMode = (e) => {
    const val = e.target.checked;
    apiService.setDemoMode(val);
    setIsDemoMode(val);
    addToast(
      val 
        ? 'Modo Demo Activo: Se simulará la base de datos MySQL localmente en localStorage.' 
        : `Modo API Real Activo: Las peticiones apuntarán a ${apiService.getApiBaseUrl()}`,
      'info'
    );
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Listado de Incidencias',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'registro',
      label: 'Registrar Incidencia',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'acerca',
      label: 'Acerca del Equipo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex transition-colors duration-200">
      
      {/* 1. BARRA LATERAL (Escritorio) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-850 flex-col shrink-0">
        
        {/* Cabecera Sidebar: Logo corporativo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-855 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-violet-500 text-white font-black text-base flex items-center justify-center rounded-xl shadow-md shadow-violet-600/20">
            HD
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">HelpDesk</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Panel Corporativo</span>
          </div>
        </div>

        {/* Links de navegación */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${currentView === item.id ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/15' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer Sidebar: Control de Modo Demo */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <label htmlFor="mode-toggle" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer">Modo Simulado</label>
              <input
                id="mode-toggle"
                type="checkbox"
                checked={isDemoMode}
                onChange={handleToggleDemoMode}
                className="w-4 h-4 text-brand-primary accent-brand-primary cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450">
                {isDemoMode ? 'MySQL Local Activo' : 'API Backend Real'}
              </span>
            </div>
          </div>
        </div>

      </aside>

      {/* 2. CONTENEDOR DERECHO (Cabecera Superior + Contenido) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* CABECERA SUPERIOR */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-850 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          
          {/* Botón menú móvil */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
              aria-label="Menú navegación"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">HelpDesk</span>
          </div>

          {/* Estado API en Escritorio */}
          <div className="hidden md:flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDemoMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
            <span className="text-xs font-semibold text-slate-550 dark:text-slate-400">
              {isDemoMode ? 'Conectado a Base de Datos MySQL (Simulada)' : 'Conexión Directa al Servidor'}
            </span>
          </div>

          {/* Panel de Usuario y Acciones del Sistema */}
          <div className="flex items-center gap-3">
            
            {/* Alternar Tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Alternar Tema"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m2.828 0l.707-.707M17.657 6.343l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              )}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>

            {/* Perfil del Usuario Autenticado */}
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold leading-none mt-1">
                    {currentUser.role}
                  </span>
                </div>
                
                {/* Avatar */}
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                />
              </div>
            )}

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>

            {/* Botón Logout */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

          </div>

        </header>

        {/* MENÚ MÓVIL DESPLEGABLE (Drawer) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${currentView === item.id ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
            
            {/* Control de modo demo en móviles */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="text-xs font-bold text-slate-500">Modo Simulado</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isDemoMode ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <input
                  type="checkbox"
                  checked={isDemoMode}
                  onChange={handleToggleDemoMode}
                  className="w-4.5 h-4.5 text-brand-primary accent-brand-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
