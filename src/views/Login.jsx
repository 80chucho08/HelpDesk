import React, { useState } from 'react';
import { apiService } from '../services/api';

/**
 * Vista de Login - Pantalla de inicio de sesión formal e interactiva.
 * Admite tanto "Usuario" plano como "Correo electrónico" y valida credenciales.
 * Incluye el interruptor de Modo Demo en la pantalla de inicio de sesión para evitar bloqueos.
 */
export default function Login({ onLoginSuccess, addToast, theme, toggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado local para alternar el Modo Demo desde el Login
  const [isDemoMode, setIsDemoMode] = useState(apiService.isDemoMode());

  // Validaciones del lado del cliente
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario o correo es requerido.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < 3) {
      newErrors.password = 'La contraseña debe tener al menos 3 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Llamar al API (simulada o real según el interruptor activo en caliente)
      const response = await apiService.login(username.trim(), password);
      
      // Prueba 1: Login correcto -> Bandera + Datos básicos
      addToast(`¡Bienvenido, ${response.user.name}! Sesión iniciada con éxito (Rol: ${response.user.role}).`, 'success');
      
      // Pasar datos al componente padre
      onLoginSuccess(response.user, response.token);
    } catch (error) {
      // Prueba 2: Login incorrecto -> Bandera + Mensaje de error
      addToast(error.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar Modo Demo y alertar al usuario
  const handleToggleDemoMode = (val) => {
    apiService.setDemoMode(val);
    setIsDemoMode(val);
    addToast(
      val 
        ? 'Modo Demo Activo: Se simulará la base de datos MySQL localmente.' 
        : `Modo API Real Activo: Las peticiones apuntarán a ${apiService.getApiBaseUrl()}`,
      'info'
    );
  };

  // Helper para autocompletar credenciales de prueba (sólo útil en Modo Demo)
  const handleFillCredentials = (testUser, testPassword) => {
    if (!isDemoMode) {
      addToast('Activa el "Modo Simulado" para poder usar las cuentas demo rápidas.', 'warning');
      return;
    }
    setUsername(testUser);
    setPassword(testPassword);
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-200 font-sans relative overflow-hidden">
      
      {/* Círculos decorativos abstractos de fondo para diseño premium */}
      <div className="absolute w-80 h-80 bg-violet-600/10 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -bottom-20 -right-20"></div>

      {/* Botón de alternar Tema en la esquina superior derecha */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
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
      </div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-lg rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col gap-6 animate-fade-in">
        
        {/* Encabezado del login */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-brand-primary to-violet-500 text-white font-black text-xl flex items-center justify-center rounded-2xl shadow-lg shadow-violet-600/30">
            HD
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Sistema de HelpDesk
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Inicia sesión con tu cuenta de usuario o correo para reportar o dar seguimiento a incidencias.
          </p>
        </div>

        {/* Interruptor de Modo Demo (Crucial para permitir login real) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 text-xs">
          <div className="flex flex-col gap-0.5 max-w-[70%]">
            <span className="font-bold text-slate-700 dark:text-slate-350">
              {isDemoMode ? 'Simulador de API (Activo)' : 'Conexión a API Real'}
            </span>
            <span className="text-[10px] text-slate-450 dark:text-slate-500 truncate block">
              {isDemoMode ? 'Usa base de datos MySQL local ficticia' : `Destino: ${apiService.getApiBaseUrl()}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isDemoMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => handleToggleDemoMode(e.target.checked)}
              className="w-4 h-4 text-brand-primary accent-brand-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Usuario / Correo */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
              Usuario o Correo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 border ${errors.username ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow'} rounded-2xl text-sm transition-all outline-none focus:ring-4`}
                placeholder="Ingresa tu usuario o correo"
              />
            </div>
            {errors.username && (
              <span className="text-xs text-rose-500 font-semibold">{errors.username}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 border ${errors.password ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow'} rounded-2xl text-sm transition-all outline-none focus:ring-4`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-500 font-semibold">{errors.password}</span>
            )}
          </div>

          {/* Botón de Acceder */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 py-3 bg-brand-primary hover:bg-brand-primary-hover active:scale-98 text-white font-bold text-sm rounded-2xl shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Iniciando sesión...
              </>
            ) : (
              'Ingresar al Portal'
            )}
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cuentas Demo</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Acceso directo a cuentas de prueba */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleFillCredentials('admin@helpdesk.com', 'admin123')}
            className={`p-2.5 border rounded-xl text-xs font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-102 transition-all cursor-pointer text-left flex flex-col gap-0.5 ${!isDemoMode ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary'}`}
          >
            <span className="text-[10px] font-bold uppercase text-brand-primary">Administrador</span>
            <span className="truncate">admin@helpdesk.com</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleFillCredentials('soporte@helpdesk.com', 'soporte123')}
            className={`p-2.5 border rounded-xl text-xs font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-102 transition-all cursor-pointer text-left flex flex-col gap-0.5 ${!isDemoMode ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 hover:border-brand-primary dark:hover:border-brand-primary'}`}
          >
            <span className="text-[10px] font-bold uppercase text-brand-primary">Soporte</span>
            <span className="truncate">soporte@helpdesk.com</span>
          </button>
        </div>

      </div>

      {/* Footer corporativo */}
      <footer className="mt-8 text-xs text-slate-450 dark:text-slate-500 relative z-10 flex flex-col items-center gap-1">
        <span>HelpDesk - Panel de Autenticación de Seguridad</span>
        <span className="text-[10px]">Vite + React 19 + Tailwind CSS v4</span>
      </footer>

    </div>
  );
}
