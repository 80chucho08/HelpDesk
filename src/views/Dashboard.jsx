import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

/**
 * Vista de Dashboard / Listado de Incidencias.
 * Permite buscar, filtrar, actualizar estados y ver la respuesta JSON del backend (Prueba 4, 5 y 6).
 */
export default function Dashboard({ addToast, currentUser }) {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  
  // Estado para actualizar incidencia
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [updating, setUpdating] = useState(false);

  // Pestaña activa del panel de detalle (Detalles o JSON Crudo)
  const [detailTab, setDetailTab] = useState('info');

  // Cargar incidencias
  const loadIncidencias = async () => {
    setLoading(true);
    try {
      const data = await apiService.getIncidencias();
      setIncidencias(data);
      
      // Si hay una incidencia seleccionada, actualizar su estado en el panel de detalle
      if (selectedIncidencia) {
        const updated = data.find(i => i.id === selectedIncidencia.id);
        if (updated) setSelectedIncidencia(updated);
      }
    } catch (error) {
      addToast('Error al consultar incidencias: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidencias();
  }, []);

  // Manejar el cambio de estado
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedIncidencia) return;

    setUpdating(true);
    try {
      const response = await apiService.actualizarEstado(
        selectedIncidencia.id,
        nuevoEstado,
        observaciones,
        currentUser ? currentUser.name : 'Administrador'
      );
      
      // Prueba 5: Actualizar estado correcto -> Bandera + cambio reflejado
      addToast(response.message || 'Estado actualizado exitosamente.', 'success');
      setObservaciones('');
      
      // Recargar listado completo
      await loadIncidencias();
    } catch (error) {
      // Prueba 6: Validar error de estado inválido -> Captura error y no altera local
      addToast(error.message || 'Error al actualizar el estado.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Filtrado de incidencias en memoria
  const filteredIncidencias = incidencias.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creador.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || item.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Colores para prioridades
  const priorityColors = {
    Baja: 'bg-blue-50 dark:bg-blue-950/30 text-blue-750 dark:text-blue-450 border border-blue-100 dark:border-blue-900/50',
    Media: 'bg-amber-50 dark:bg-amber-950/30 text-amber-750 dark:text-amber-450 border border-amber-100 dark:border-amber-900/50',
    Alta: 'bg-rose-50 dark:bg-rose-950/30 text-rose-750 dark:text-rose-450 border border-rose-100 dark:border-rose-900/50'
  };

  // Colores para estados
  const statusColors = {
    Abierto: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/60',
    'En Proceso': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-450 border border-amber-250 dark:border-amber-900/60',
    Cerrado: 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Listado de Incidencias
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitorea, filtra y gestiona los reportes del sistema en tiempo real.
          </p>
        </div>
        
        {/* Botón de recarga rápida */}
        <button
          onClick={loadIncidencias}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className={`w-4 h-4 text-slate-550 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Sincronizar
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm">
        
        {/* Buscador */}
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, asunto o creador..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow rounded-xl text-sm transition-all outline-none"
          />
        </div>

        {/* Filtro de Estado */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Estado:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 focus:border-brand-primary focus:ring-brand-primary-glow rounded-xl text-sm transition-all outline-none"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Abierto">Abierto</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

      </div>

      {/* Contenedor Principal (Listado + Detalle) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Tabla / Lista de Tarjetas */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {loading && incidencias.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl gap-3">
              <svg className="w-8 h-8 text-brand-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-semibold text-slate-500">Consultando API de incidencias...</span>
            </div>
          ) : filteredIncidencias.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-900 dark:text-white font-bold">No se encontraron incidencias</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                No hay registros que coincidan con la búsqueda o el filtro seleccionado en este momento.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredIncidencias.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedIncidencia(item);
                    setNuevoEstado(item.estado);
                    setObservaciones('');
                  }}
                  className={`p-5 bg-white dark:bg-slate-900 border transition-all duration-200 rounded-2xl cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary shadow-sm hover:shadow flex flex-col gap-3 sm:flex-row sm:items-center justify-between ${selectedIncidencia?.id === item.id ? 'ring-2 ring-brand-primary border-brand-primary' : 'border-slate-250/60 dark:border-slate-800'}`}
                >
                  <div className="flex flex-col gap-2.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityColors[item.prioridad]}`}>
                        Prioridad {item.prioridad}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-550">
                        {new Date(item.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-950 dark:text-white leading-tight">
                      {item.asunto}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.descripcion}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Reporta: {item.creador}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:flex-col sm:items-end">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[item.estado]}`}>
                      {item.estado}
                    </span>
                    <span className="text-xs text-brand-primary font-semibold hover:underline flex items-center gap-1">
                      Gestionar
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Detalle Derecho */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {selectedIncidencia ? (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col gap-5">
              
              {/* Cabecera del Panel */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                  {selectedIncidencia.id}
                </span>
                
                {/* Selector de Pestañas del Panel */}
                <div className="flex border border-slate-100 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-950">
                  <button
                    onClick={() => setDetailTab('info')}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer ${detailTab === 'info' ? 'bg-white dark:bg-slate-850 shadow text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => setDetailTab('json')}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer ${detailTab === 'json' ? 'bg-white dark:bg-slate-850 shadow text-brand-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    JSON
                  </button>
                </div>
              </div>

              {detailTab === 'info' ? (
                <>
                  {/* Vista de Información de la Incidencia */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white leading-tight">
                      {selectedIncidencia.asunto}
                    </h2>
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColors[selectedIncidencia.estado]}`}>
                        {selectedIncidencia.estado}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded font-semibold">
                        {selectedIncidencia.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                  {/* Descripción */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descripción completa</span>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                      {selectedIncidencia.descripcion}
                    </p>
                  </div>

                  {/* Historial de Cambios (Prueba 4) */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Historial / Auditoría</span>
                    <div className="flex flex-col gap-3 pl-2.5 border-l border-slate-150 dark:border-slate-800">
                      {selectedIncidencia.historial.map((hist, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5 relative">
                          <span className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white dark:ring-slate-900"></span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="font-bold text-slate-600 dark:text-slate-355">{hist.usuario}</span>
                            <span>•</span>
                            <span>{new Date(hist.fecha).toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Estado cambiado a: <strong className="text-brand-primary">{hist.estado}</strong>
                          </span>
                          <span className="text-xs italic text-slate-500 dark:text-slate-450 leading-tight">
                            "{hist.observacion}"
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                  {/* Formulario de actualización de estado (Prueba 5 y 6) */}
                  <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/20 p-4 border border-slate-150/60 dark:border-slate-850 rounded-2xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Actualizar Estado</h3>
                    
                    {/* Selector de estado */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="select-estado" className="text-[10px] font-bold text-slate-500">Nuevo Estado</label>
                      <select
                        id="select-estado"
                        value={nuevoEstado}
                        onChange={(e) => setNuevoEstado(e.target.value)}
                        className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-primary rounded-xl text-xs outline-none"
                      >
                        <option value="Abierto">Abierto</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </div>

                    {/* Observaciones (Obligatorio) */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="textarea-obs" className="text-[10px] font-bold text-slate-500">Observaciones/Justificación (Requerido)</label>
                      <textarea
                        id="textarea-obs"
                        rows="2"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Escribe el motivo del cambio de estado..."
                        className="w-full px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-primary rounded-xl text-xs outline-none resize-none"
                      />
                    </div>

                    {/* Botón de actualizar */}
                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full py-2 bg-brand-primary hover:bg-brand-primary-hover active:scale-98 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {updating ? 'Procesando cambio...' : 'Guardar Estado'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Vista de JSON Crudo de la consulta (Prueba 4) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Respuesta JSON de la Consulta</h3>
                      <p className="text-[10px] text-slate-500">
                        Estructura cruda del objeto JSON devuelto por la API.
                      </p>
                    </div>

                    <pre className="p-4 bg-slate-950 border border-slate-850 rounded-2xl overflow-x-auto text-[10.5px] font-mono text-emerald-400 text-left select-all max-h-[450px]">
                      {JSON.stringify(selectedIncidencia, null, 2)}
                    </pre>

                    <div className="flex items-center gap-1.5 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-[10px] text-emerald-800 dark:text-emerald-300">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Este formato JSON es el que se consume y procesa dinámicamente en la interfaz.</span>
                    </div>
                  </div>
                </>
              )}

            </div>
          ) : (
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px] gap-2">
              <span className="text-slate-450 dark:text-slate-550">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </span>
              <p className="text-xs font-bold text-slate-500">Selecciona una incidencia</p>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 max-w-[180px]">
                Haz clic sobre cualquier elemento del listado para ver su auditoría e historial y actualizar su estado.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
