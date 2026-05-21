import React, { useEffect } from 'react';

/**
 * Toast Component - Renderiza un banner o notificación flotante elegante
 * para informar al usuario el resultado de sus acciones (Pruebas de éxito/error).
 */
export default function Toast({ id, message, type = 'success', onClose }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4500); // 4.5 segundos antes de desvanecerse

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800/80',
      textColor: 'text-emerald-800 dark:text-emerald-300',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-200 dark:border-rose-800/80',
      textColor: 'text-rose-800 dark:text-rose-300',
      iconColor: 'text-rose-500 dark:text-rose-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-800/80',
      textColor: 'text-amber-800 dark:text-amber-300',
      iconColor: 'text-amber-500 dark:text-amber-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-200 dark:border-sky-800/80',
      textColor: 'text-sky-800 dark:text-sky-300',
      iconColor: 'text-sky-500 dark:text-sky-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentType = typeConfig[type] || typeConfig.success;

  return (
    <div 
      className={`w-full max-w-sm flex items-start gap-3 p-4 border rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 animate-fade-in ${currentType.bgColor} ${currentType.borderColor} ${currentType.textColor}`}
      role="alert"
    >
      {/* Icono de estado */}
      <div className={`flex-shrink-0 ${currentType.iconColor} mt-0.5`}>
        {currentType.icon}
      </div>
      
      {/* Contenido */}
      <div className="flex-1 text-sm font-medium leading-relaxed pr-2">
        {message}
      </div>

      {/* Botón de cierre manual */}
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        aria-label="Cerrar notificación"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
