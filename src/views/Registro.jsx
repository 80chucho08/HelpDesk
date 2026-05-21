import React, { useState } from 'react';
import { apiService } from '../services/api';

/**
 * Vista de Registro de Incidencias.
 * Formulario formal con validación que interactúa con el apiService (Prueba 3).
 */
export default function Registro({ addToast, currentUser, onViewChange }) {
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido.';
    } else if (asunto.trim().length < 5) {
      newErrors.asunto = 'El asunto debe tener al menos 5 caracteres.';
    }

    if (!categoria) {
      newErrors.categoria = 'Selecciona una categoría.';
    }

    if (!prioridad) {
      newErrors.prioridad = 'Selecciona el nivel de prioridad.';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción detallada es requerida.';
    } else if (descripcion.trim().length < 15) {
      newErrors.descripcion = 'Describe el problema con al menos 15 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        asunto: asunto.trim(),
        categoria,
        prioridad,
        descripcion: descripcion.trim()
      };

      const userDisplayName = currentUser ? currentUser.name : 'Usuario Demo';
      
      const response = await apiService.registrarIncidencia(payload, userDisplayName);
      
      // Prueba 3: Registrar incidencia -> Bandera indicando registro guardado en MySQL
      addToast(response.message || 'Incidencia guardada exitosamente en la base de datos MySQL (Simulado).', 'success');

      // Limpiar formulario
      setAsunto('');
      setCategoria('');
      setPrioridad('');
      setDescripcion('');
      
      // Redireccionar al listado de incidencias después de un momento
      setTimeout(() => {
        onViewChange('dashboard');
      }, 1500);

    } catch (error) {
      addToast(error.message || 'Error al guardar la incidencia.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fade-in">
      
      {/* Cabecera */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Registrar Incidencia
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Completa el formulario para reportar una falla técnica o solicitud de soporte.
        </p>
      </div>

      {/* Formulario */}
      <form 
        onSubmit={handleSubmit} 
        className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col gap-6"
      >
        
        {/* Asunto */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="asunto" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
            Asunto o Título Corto
          </label>
          <input
            id="asunto"
            type="text"
            disabled={isLoading}
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className={`w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 border ${errors.asunto ? 'border-rose-500 focus:ring-rose-550/20' : 'border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow'} rounded-2xl text-sm transition-all outline-none focus:ring-4`}
            placeholder="Ej: Falla de red en planta alta"
          />
          {errors.asunto && (
            <span className="text-xs text-rose-500 font-semibold">{errors.asunto}</span>
          )}
        </div>

        {/* Categoría y Prioridad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="categoria" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
              Categoría
            </label>
            <select
              id="categoria"
              disabled={isLoading}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={`w-full px-3 py-3 bg-slate-50/50 dark:bg-slate-950/30 border ${errors.categoria ? 'border-rose-500 focus:ring-rose-555/20' : 'border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow'} rounded-2xl text-sm transition-all outline-none focus:ring-4`}
            >
              <option value="">-- Selecciona --</option>
              <option value="Hardware">Hardware (Equipos, Impresoras)</option>
              <option value="Software">Software (Sistemas, Programas)</option>
              <option value="Redes y Servidores">Redes y Servidores</option>
              <option value="Accesos y Seguridad">Accesos y Seguridad</option>
              <option value="Telefonía">Telefonía</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.categoria && (
              <span className="text-xs text-rose-500 font-semibold">{errors.categoria}</span>
            )}
          </div>

          {/* Prioridad */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prioridad" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
              Prioridad
            </label>
            <select
              id="prioridad"
              disabled={isLoading}
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className={`w-full px-3 py-3 bg-slate-50/50 dark:bg-slate-950/30 border ${errors.prioridad ? 'border-rose-500 focus:ring-rose-555/20' : 'border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow'} rounded-2xl text-sm transition-all outline-none focus:ring-4`}
            >
              <option value="">-- Selecciona --</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
            {errors.prioridad && (
              <span className="text-xs text-rose-500 font-semibold">{errors.prioridad}</span>
            )}
          </div>

        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="descripcion" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
            Descripción Detallada del Problema
          </label>
          <textarea
            id="descripcion"
            disabled={isLoading}
            rows="5"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={`w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/30 border ${errors.descripcion ? 'border-rose-500 focus:ring-rose-555/20' : 'border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow'} rounded-2xl text-sm transition-all outline-none focus:ring-4 resize-y`}
            placeholder="Por favor, describe a detalle la incidencia. Incluye número de equipo, mensajes de error específicos y cualquier prueba que hayas realizado."
          />
          {errors.descripcion && (
            <span className="text-xs text-rose-500 font-semibold">{errors.descripcion}</span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onViewChange('dashboard')}
            className="px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover active:scale-98 text-white font-bold text-xs rounded-2xl shadow-lg shadow-violet-600/10 transition-all cursor-pointer flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registrando...
              </>
            ) : (
              'Enviar Reporte'
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
