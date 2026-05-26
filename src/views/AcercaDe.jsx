import React from 'react';

/**
 * Vista Acerca De - Presenta información institucional del proyecto y datos
 * académicos del equipo de desarrollo de HelpDesk.
 */
export default function AcercaDe() {
  const equipo = [
    {
      nombre: 'Jesús Alfonso Navarro Carbajal',
      rol: 'Desarrollador Full Stack / UI Architect',
      carrera: 'Ingeniería en Sistemas Computacionales',
      institucion: 'Instituto Tecnologico de Pachuca',
      Nocontrol: '22200964',
      email: 'l22200964@pachuca.tecnm.mx',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80'
    },
    {
      nombre: 'Luis Carlos Marquez Strociak',
      rol: 'Especialista en QA / Diseñador de Base de Datos',
      carrera: 'Ingeniería en Sistemas Computacionales',
      institucion: 'Instituto Tecnologico de Pachuca',
      Nocontrol: '23200259',
      email: 'l23200259@pachuca.tecnm.mx',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
    }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Encabezado */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Acerca del Proyecto
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Información académica e institucional del sistema HelpDesk desarrollado para la gestión eficiente de reportes e incidencias.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tarjeta Informativa del Proyecto */}
        <div className="lg:col-span-1 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex flex-col gap-5 shadow-sm">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-950/40 text-brand-primary rounded-2xl flex items-center justify-center font-bold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Detalles del Proyecto
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
              Esta aplicación fue construida como entregable académico para acreditar la materia de **Ingeniería FullStack**. Cumple con los lineamientos de integración con API, protección de vistas (Login) y persistencia del estado en base de datos.
            </p>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Atributos Clave */}
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">Materia:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">Ingeniería FullStack</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">Ciclo Académico:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">Enero - Junio 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">Versión:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">v1.0-MVP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider">Base de Datos:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">MySQL (Relacional)</span>
            </div>
          </div>
        </div>

        {/* Tarjetas de los Integrantes del Equipo */}
        <div className="lg:col-span-2 flex flex-col sm:grid sm:grid-cols-2 gap-6">
          {equipo.map((persona, index) => (
            <div 
              key={index}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl flex flex-col items-center text-center gap-4 hover:scale-[1.02] transition-transform duration-200 shadow-sm"
            >
              {/* Foto / Avatar */}
              <div className="relative">
                <img 
                  src={persona.avatar} 
                  alt={persona.nombre}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-850 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </div>

              {/* Información General */}
              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-extrabold text-slate-950 dark:text-white leading-tight">
                  {persona.nombre}
                </h3>
                <span className="text-xs text-brand-primary font-bold">
                  {persona.rol}
                </span>
              </div>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

              {/* Datos Académicos */}
              <div className="flex flex-col gap-2 w-full text-left text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Carrera</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 leading-snug">{persona.carrera}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">No. Control</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{persona.Nocontrol}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Contacto</span>
                    <a 
                      href={`mailto:${persona.email}`} 
                      className="font-medium text-brand-primary hover:underline"
                    >
                      Enviar correo
                    </a>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
