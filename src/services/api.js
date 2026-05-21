/**
 * Servicio de API para HelpDesk
 * Soporta llamadas reales a la API configurada y un "Modo Demo" con persistencia local
 * para cumplir con las pruebas de validación requeridas.
 */

const FALLBACK_URL = 'http://localhost:8080';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || FALLBACK_URL;

// Base de datos de simulación inicial
const MOCK_USERS = [
  {
    id: 1,
    name: 'Carlos Administrador',
    email: 'admin@helpdesk.com',
    role: 'Administrador',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 2,
    name: 'Laura Soporte',
    email: 'soporte@helpdesk.com',
    role: 'Soporte',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 3,
    name: 'Juan Usuario',
    email: 'usuario@helpdesk.com',
    role: 'Usuario',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

const DEFAULT_INCIDENCIAS = [
  {
    id: 'INC-001',
    asunto: 'Fallo crítico en impresora de contabilidad',
    categoria: 'Hardware',
    prioridad: 'Media',
    estado: 'Abierto',
    descripcion: 'La impresora HP de la oficina de contabilidad no enciende ni responde a la red. Se revisaron cables de energía y red, pero sigue inactiva. Afecta el cierre mensual.',
    fechaCreacion: '2026-05-20T10:30:00Z',
    creador: 'Ana Gómez (Contabilidad)',
    observaciones: 'Reportado por primera vez por correo corporativo.',
    historial: [
      { fecha: '2026-05-20T10:30:00Z', estado: 'Abierto', observacion: 'Incidencia creada en el sistema.', usuario: 'Ana Gómez' }
    ]
  },
  {
    id: 'INC-002',
    asunto: 'El servidor de correo corporativo no responde',
    categoria: 'Redes y Servidores',
    prioridad: 'Alta',
    estado: 'En Proceso',
    descripcion: 'Los usuarios no pueden sincronizar Outlook ni enviar correos externos. El servicio IMAP/SMTP parece caído en el servidor principal.',
    fechaCreacion: '2026-05-21T08:15:00Z',
    creador: 'Pedro Martínez (Sistemas)',
    observaciones: 'Se está reiniciando el servicio de correo y revisando el almacenamiento.',
    historial: [
      { fecha: '2026-05-21T08:15:00Z', estado: 'Abierto', observacion: 'Incidencia creada automáticamente.', usuario: 'Pedro Martínez' },
      { fecha: '2026-05-21T09:00:00Z', estado: 'En Proceso', observacion: 'Revisando logs de postfix y verificando uso de disco.', usuario: 'Laura Soporte' }
    ]
  },
  {
    id: 'INC-003',
    asunto: 'Actualización obligatoria de software contable (Contpaq)',
    categoria: 'Software',
    prioridad: 'Baja',
    estado: 'Cerrado',
    descripcion: 'Se requiere instalar la última versión del software contable debido a reformas fiscales. Se programó fuera de horario laboral para no interrumpir operaciones.',
    fechaCreacion: '2026-05-18T16:00:00Z',
    creador: 'Ana Gómez (Contabilidad)',
    observaciones: 'Instalación y pruebas completadas con éxito. Base de datos migrada.',
    historial: [
      { fecha: '2026-05-18T16:00:00Z', estado: 'Abierto', observacion: 'Incidencia creada.', usuario: 'Ana Gómez' },
      { fecha: '2026-05-18T18:30:00Z', estado: 'En Proceso', observacion: 'Comenzando instalación en servidor local.', usuario: 'Laura Soporte' },
      { fecha: '2026-05-18T20:00:00Z', estado: 'Cerrado', observacion: 'Actualización finalizada y validada por el usuario.', usuario: 'Laura Soporte' }
    ]
  }
];

// Inicializar base de datos de simulación en localStorage
const initStorage = () => {
  if (!localStorage.getItem('hd_incidencias')) {
    localStorage.setItem('hd_incidencias', JSON.stringify(DEFAULT_INCIDENCIAS));
  }
  if (localStorage.getItem('hd_demo_mode') === null) {
    localStorage.setItem('hd_demo_mode', 'true'); // Por defecto activamos Modo Demo
  }
};

initStorage();

export const apiService = {
  // Manejo del Modo Demo/Simulación
  isDemoMode() {
    return localStorage.getItem('hd_demo_mode') === 'true';
  },

  setDemoMode(value) {
    localStorage.setItem('hd_demo_mode', value ? 'true' : 'false');
  },

  getApiBaseUrl() {
    return API_BASE_URL;
  },

  // 1. Iniciar sesión (POST /api/acceso/login)
  async login(email, password) {
    console.log(`[API Call] POST /api/acceso/login - Email: ${email}`);

    if (this.isDemoMode()) {
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Validación mock
      if (user && password === 'admin123' || (user && user.role === 'Soporte' && password === 'soporte123') || (user && user.role === 'Usuario' && password === 'usuario123')) {
        return {
          success: true,
          message: 'Autenticación exitosa',
          user: { ...user },
          token: 'jwt-mock-token-xyz-12345'
        };
      } else {
        throw new Error('Credenciales inválidas. Revisa el correo o la contraseña (pistas: admin123, soporte123, usuario123).');
      }
    }

    // Petición real
    try {
      const response = await fetch(`${API_BASE_URL}/api/acceso/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error de autenticación en servidor');
      }
      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Error en login real:', error);
      throw error;
    }
  },

  // 2. Obtener incidencias (GET /api/incidencias)
  async getIncidencias() {
    console.log('[API Call] GET /api/incidencias');

    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const list = JSON.parse(localStorage.getItem('hd_incidencias'));
      return list;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/incidencias`, {
        headers: this._getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener incidencias del servidor');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener incidencias reales:', error);
      throw error;
    }
  },

  // 3. Obtener incidencia por ID (GET /api/incidencias/{id})
  async getIncidenciaById(id) {
    console.log(`[API Call] GET /api/incidencias/${id}`);

    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const list = JSON.parse(localStorage.getItem('hd_incidencias'));
      const item = list.find(i => i.id === id);
      if (!item) throw new Error('Incidencia no encontrada.');
      return item;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/incidencias/${id}`, {
        headers: this._getAuthHeaders()
      });
      if (!response.ok) throw new Error('Error al obtener los detalles de la incidencia');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener incidencia real por ID:', error);
      throw error;
    }
  },

  // 4. Registrar incidencia (POST /api/incidencias)
  async registrarIncidencia(nuevaIncidencia, usuarioNombre = 'Usuario') {
    console.log('[API Call] POST /api/incidencias', nuevaIncidencia);

    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validaciones básicas
      if (!nuevaIncidencia.asunto || !nuevaIncidencia.descripcion || !nuevaIncidencia.categoria || !nuevaIncidencia.prioridad) {
        throw new Error('Todos los campos del formulario son obligatorios.');
      }

      const list = JSON.parse(localStorage.getItem('hd_incidencias'));
      
      const newIdNum = list.length + 1;
      const formattedId = `INC-${String(newIdNum).padStart(3, '0')}`;

      const createdItem = {
        id: formattedId,
        asunto: nuevaIncidencia.asunto,
        categoria: nuevaIncidencia.categoria,
        prioridad: nuevaIncidencia.prioridad,
        estado: 'Abierto', // Por defecto inicia Abierto
        descripcion: nuevaIncidencia.descripcion,
        fechaCreacion: new Date().toISOString(),
        creador: usuarioNombre,
        observaciones: 'Registro inicial creado en MySQL (Simulado).',
        historial: [
          {
            fecha: new Date().toISOString(),
            estado: 'Abierto',
            observacion: 'Incidencia reportada por el usuario.',
            usuario: usuarioNombre
          }
        ]
      };

      list.unshift(createdItem); // Insertar al inicio para que aparezca primero
      localStorage.setItem('hd_incidencias', JSON.stringify(list));

      return {
        success: true,
        message: 'Registro guardado exitosamente en base de datos MySQL (Simulado).',
        incidencia: createdItem
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/incidencias`, {
        method: 'POST',
        headers: this._getAuthHeaders(),
        body: JSON.stringify(nuevaIncidencia)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar la incidencia en el servidor');
      }
      return {
        success: true,
        message: data.message || 'Incidencia registrada con éxito',
        incidencia: data.incidencia
      };
    } catch (error) {
      console.error('Error al registrar incidencia real:', error);
      throw error;
    }
  },

  // 5. Actualizar estado de incidencia (PUT /api/incidencias/{id}/estado)
  async actualizarEstado(id, nuevoEstado, observaciones, usuarioNombre = 'Administrador') {
    console.log(`[API Call] PUT /api/incidencias/${id}/estado - Estado: ${nuevoEstado}`);

    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 600));

      // Caso de error de la Prueba 6: Observaciones vacías o estado vacío
      if (!observaciones || observaciones.trim() === '') {
        throw new Error('Se requiere ingresar una observación/comentario obligatoriamente para justificar el cambio de estado.');
      }

      if (!nuevoEstado || nuevoEstado.trim() === '') {
        throw new Error('Estado inválido o no especificado.');
      }

      const list = JSON.parse(localStorage.getItem('hd_incidencias'));
      const index = list.findIndex(i => i.id === id);

      if (index === -1) {
        throw new Error('La incidencia solicitada no existe.');
      }

      const incidencia = list[index];

      // Regla de Negocio: No se puede cambiar el estado de una incidencia Cerrada
      if (incidencia.estado === 'Cerrado' && nuevoEstado !== 'Cerrado') {
        throw new Error('No se admiten cambios de estado en incidencias que ya han sido cerradas definitivamente.');
      }

      // Regla de Negocio: No se puede cambiar al mismo estado
      if (incidencia.estado === nuevoEstado) {
        throw new Error(`La incidencia ya se encuentra en estado "${nuevoEstado}". Selecciona un estado diferente.`);
      }

      // Transiciones permitidas (Simuladas para Prueba 6)
      // Ejemplo: No se puede saltar directamente de "Abierto" a "Cerrado" sin pasar por "En Proceso" (para simular fallo de reglas)
      // Excepto si es Administrador. Si simulamos un error:
      if (incidencia.estado === 'Abierto' && nuevoEstado === 'Cerrado') {
        throw new Error('Transición de estado no permitida: No es posible cerrar una incidencia en estado "Abierto" directamente sin antes marcarla "En Proceso" para su revisión.');
      }

      // Aplicar actualización
      incidencia.estado = nuevoEstado;
      incidencia.observaciones = observaciones;
      incidencia.historial.push({
        fecha: new Date().toISOString(),
        estado: nuevoEstado,
        observacion: observaciones,
        usuario: usuarioNombre
      });

      list[index] = incidencia;
      localStorage.setItem('hd_incidencias', JSON.stringify(list));

      return {
        success: true,
        message: `Estado actualizado exitosamente a "${nuevoEstado}".`,
        incidencia: { ...incidencia }
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/incidencias/${id}/estado`, {
        method: 'PUT',
        headers: this._getAuthHeaders(),
        body: JSON.stringify({ estado: nuevoEstado, observaciones })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el estado en el servidor');
      }
      return {
        success: true,
        message: data.message || 'Estado actualizado con éxito',
        incidencia: data.incidencia
      };
    } catch (error) {
      console.error('Error al actualizar estado real:', error);
      throw error;
    }
  },

  // Helper para headers con token JWT
  _getAuthHeaders() {
    const sessionStr = localStorage.getItem('helpdesk_session');
    const headers = { 'Content-Type': 'application/json' };
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.token) {
          headers['Authorization'] = `Bearer ${session.token}`;
        }
      } catch (e) {
        console.error('Error al leer token de localStorage', e);
      }
    }
    return headers;
  }
};
