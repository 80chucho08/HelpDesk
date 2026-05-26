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

  /**
   * Helper unificado para realizar peticiones HTTP reales a la API
   * Muestra logs detallados y maneja errores de red / CORS / SSL
   */
  async _request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.group(`🔌 [API Request] ${options.method || 'GET'} ${endpoint}`);
    console.log('URL de Destino:', url);
    if (options.body) {
      try {
        console.log('Payload enviado:', JSON.parse(options.body));
      } catch (e) {
        console.log('Payload enviado (raw):', options.body);
      }
    }
    console.groupEnd();

    try {
      const response = await fetch(url, options);
      
      console.group(`📥 [API Response] ${options.method || 'GET'} ${endpoint}`);
      console.log('HTTP Status:', response.status, response.statusText);
      
      let data = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? { message: text } : {};
      }
      console.log('Respuesta recibida:', data);
      console.groupEnd();

      if (!response.ok) {
        throw new Error(data.message || data.mensaje || data.msg || data.error || `Error del servidor (${response.status})`);
      }
      return data;
    } catch (error) {
      console.group(`❌ [API Network Error] ${options.method || 'GET'} ${endpoint}`);
      console.error(error);
      console.groupEnd();

      // Diagnóstico detallado para fallas de red comunes en localhost (CORS, SSL, Host Caído)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error(
          `No se pudo establecer comunicación con el backend local en ${API_BASE_URL}. \n\n` +
          `Verifica lo siguiente:\n` +
          `1) ¿El backend está corriendo y escuchando en ese puerto?\n` +
          `2) Si usa HTTPS, ¿aceptaste el certificado auto-firmado en tu navegador? Abre directamente ${API_BASE_URL} en otra pestaña del navegador y aprueba el certificado.\n` +
          `3) ¿Tiene habilitadas las políticas de CORS tu backend? Asegúrate de que tu backend permita solicitudes HTTP (CORS) desde el puerto de tu React (normalmente http://localhost:5173).`
        );
      }
      throw error;
    }
  },

  /* =========================================================================
     TRADUCTORES DE ENUMS (Frontend Strings <-> Backend Integers/Strings)
     ========================================================================= */

  // Categorías: Hardware=0, Software=1, Redes y Servidores=2, Accesos y Seguridad=3, Telefonía=4, Otros=5
  _mapCategoriaToBackend(cat) {
    const map = {
      'Hardware': 0,
      'Software': 1,
      'Redes y Servidores': 2,
      'Accesos y Seguridad': 3,
      'Telefonía': 4,
      'Otros': 5
    };
    return map[cat] ?? 5;
  },

  _mapCategoriaToFrontend(catNum) {
    const map = {
      0: 'Hardware',
      1: 'Software',
      2: 'Redes y Servidores',
      3: 'Accesos y Seguridad',
      4: 'Telefonía',
      5: 'Otros'
    };
    return map[catNum] ?? 'Otros';
  },

  // Prioridades: Baja=0, Media=1, Alta=2
  _mapPrioridadToBackend(prio) {
    const map = {
      'Baja': 0,
      'Media': 1,
      'Alta': 2
    };
    return map[prio] ?? 0;
  },

  _mapPrioridadToFrontend(prioNum) {
    const map = {
      0: 'Baja',
      1: 'Media',
      2: 'Alta'
    };
    return map[prioNum] ?? 'Baja';
  },

  // Estados/Status en Backend: Abierta=0, En_Proceso=1, Cerrada=2
  _mapEstadoToBackend(estado) {
    const map = {
      'Abierto': 0,
      'Abierta': 0,
      'En Proceso': 1,
      'En_Proceso': 1,
      'Cerrado': 2,
      'Cerrada': 2
    };
    return map[estado] ?? 0;
  },

  _mapEstadoToBackendText(estado) {
    if (!estado) return 'Abierta';
    const est = String(estado).trim();
    if (est === 'Abierto' || est === 'Abierta') return 'Abierta';
    if (est === 'Cerrado' || est === 'Cerrada') return 'Cerrada';
    if (est === 'En Proceso' || est === 'En_Proceso' || est === 'En proceso') return 'En_Proceso';
    return est;
  },

  _mapEstadoToFrontend(estadoVal) {
    if (estadoVal === 0 || estadoVal === '0' || estadoVal === 'Abierta' || estadoVal === 'Abierto') return 'Abierto';
    if (estadoVal === 1 || estadoVal === '1' || estadoVal === 'En_Proceso' || estadoVal === 'En Proceso') return 'En Proceso';
    if (estadoVal === 2 || estadoVal === '2' || estadoVal === 'Cerrada' || estadoVal === 'Cerrado') return 'Cerrado';
    return 'Abierto';
  },

  /* =========================================================================
     MÉTODOS PRINCIPALES DE LA API
     ========================================================================= */

  /**
   * Helper para extraer un Array de incidencias de forma flexible de cualquier
   * estructura de respuesta del Backend (por ejemplo, encapsuladas en 'datos' o 'data')
   */
  _extractArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    const target = data.datos ?? data.data ?? data.items ?? data.list ?? data.incidencias;
    if (Array.isArray(target)) return target;

    if (target && typeof target === 'object') {
      if (Array.isArray(target.incidencias)) return target.incidencias;
      if (Array.isArray(target.items)) return target.items;
      if (Array.isArray(target.data)) return target.data;
      if (Array.isArray(target.list)) return target.list;

      for (const key in target) {
        if (Array.isArray(target[key])) {
          return target[key];
        }
      }

      if (target.id || target.id_incidencia || target.asunto || target.titulo) {
        return [target];
      }
    }

    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }

    if (typeof data === 'object') {
      if (data.id || data.id_incidencia || data.asunto || data.titulo) {
        return [data];
      }
    }

    return [];
  },

  /**
   * Normaliza propiedades del Backend a campos estandarizados de React
   */
  _mapIncidencia(rawItem) {
    if (!rawItem) return null;

    // Normalizar ID
    const idVal = rawItem.id ?? rawItem.id_incidencia ?? rawItem.idIncidencia ?? rawItem.folio ?? '';
    const id = idVal !== '' ? String(idVal) : 'INC-000';

    // Traducir campos de texto del Enum Numérico o String
    const asunto = rawItem.titulo ?? rawItem.asunto ?? rawItem.nombre ?? rawItem.issue ?? 'Sin Asunto';
    const categoria = this._mapCategoriaToFrontend(rawItem.categoria);
    const prioridad = this._mapPrioridadToFrontend(rawItem.prioridad);
    
    // Normalizar el estado al género masculino para que funcione con el CSS y los selectores
    const rawEstado = rawItem.status ?? rawItem.estado ?? rawItem.state ?? 0;
    const estado = this._mapEstadoToFrontend(rawEstado);
    
    const descripcion = rawItem.descripcion ?? rawItem.description ?? rawItem.detalle ?? 'Sin Descripción';
    
    // Metadatos
    const fechaCreacion = rawItem.fechaCreacion ?? rawItem.fecha_creacion ?? rawItem.fecha ?? rawItem.createdAt ?? new Date().toISOString();
    const creador = rawItem.creador ?? rawItem.usuario ?? rawItem.reporta ?? rawItem.nombreUsuario ?? 'Usuario';
    const observaciones = rawItem.observaciones ?? rawItem.comentarios ?? rawItem.observacion ?? '';

    // Historial / Auditoría de Cambios
    const rawHistorial = rawItem.historial ?? rawItem.logs ?? rawItem.movimientos;
    let historial = [];
    if (Array.isArray(rawHistorial)) {
      historial = rawHistorial.map(h => ({
        fecha: h.fecha ?? h.createdAt ?? new Date().toISOString(),
        estado: this._mapEstadoToFrontend(h.estado ?? h.status ?? 0),
        observacion: h.observacion ?? h.observaciones ?? 'Cambio registrado',
        usuario: h.usuario ?? h.nombreUsuario ?? 'Usuario'
      }));
    } else {
      historial = [
        {
          fecha: fechaCreacion,
          estado: 'Abierto',
          observacion: observaciones || 'Incidencia registrada en el sistema.',
          usuario: creador
        }
      ];
      if (estado !== 'Abierto') {
        historial.push({
          fecha: new Date().toISOString(),
          estado: estado,
          observacion: observaciones || 'Estado actualizado por el sistema.',
          usuario: 'Sistema'
        });
      }
    }

    return {
      id,
      asunto,
      categoria,
      prioridad,
      estado,
      descripcion,
      fechaCreacion,
      creador,
      observaciones,
      historial
    };
  },

  // 1. Iniciar sesión (POST /api/acceso/login)
  async login(email, password) {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
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
    const bodyData = {
      email: email,
      password: password,
      correo: email,
      usuario: email,
      contrasena: password,
      clave: password
    };

    const data = await this._request('/api/acceso/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    // Comprobar éxito lógico del Backend
    const isSuccess = data.statusExec === true || data.statusExec === 1 || data.success === true || data.flag === 1 || data.flag === true || data.id !== undefined;
    if (!isSuccess) {
      throw new Error(data.msg || data.message || data.mensaje || 'Usuario o contraseña incorrectos.');
    }

    // Extraer datos del usuario de forma flexible (buscando arrays anidados en 'datos.usuario')
    let rawUser = data.datos || data.user || data.usuario || data.data || data;
    if (rawUser && rawUser.usuario) {
      if (Array.isArray(rawUser.usuario)) {
        rawUser = rawUser.usuario[0]; // Extraemos el primer objeto del array
      } else {
        rawUser = rawUser.usuario;
      }
    } else if (Array.isArray(rawUser)) {
      rawUser = rawUser[0];
    }

    const extractedToken = data.token || data.accessToken || data.jwt || 'jwt-token-placeholder';

    // Mapear campos con soporte para id_usuario y correo_institucional de tu base de datos MySQL
    const mappedUser = {
      id: rawUser.id_usuario ?? rawUser.idUsuario ?? rawUser.id ?? rawUser.Id ?? rawUser.IdUsuario ?? rawUser.Id_Usuario ?? 1,
      name: rawUser.nombre_completo ?? rawUser.Nombre_Completo ?? rawUser.nombreCompleto ?? rawUser.NombreCompleto ?? rawUser.name ?? rawUser.Name ?? rawUser.nombre ?? rawUser.Nombre ?? 'Usuario',
      email: rawUser.correo_institucional ?? rawUser.correo ?? rawUser.correo_Institucional ?? rawUser.email ?? rawUser.Email ?? email,
      role: rawUser.rol ?? rawUser.Rol ?? rawUser.role ?? rawUser.Role ?? 'Usuario',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.nombre_completo || rawUser.name || 'Usuario')}&background=8b5cf6&color=fff`
    };

    return {
      success: true,
      user: mappedUser,
      token: extractedToken
    };
  },

  // 2. Obtener incidencias (GET /api/incidencias)
  async getIncidencias() {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return JSON.parse(localStorage.getItem('hd_incidencias'));
    }

    const data = await this._request('/api/incidencias', {
      headers: this._getAuthHeaders()
    });

    const arr = this._extractArray(data);
    return arr.map(item => this._mapIncidencia(item)).filter(Boolean);
  },

  // 3. Obtener incidencia por ID (GET /api/incidencias/{id})
  async getIncidenciaById(id) {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const list = JSON.parse(localStorage.getItem('hd_incidencias'));
      const item = list.find(i => i.id === id);
      if (!item) throw new Error('Incidencia no encontrada.');
      return item;
    }

    const data = await this._request(`/api/incidencias/${id}`, {
      headers: this._getAuthHeaders()
    });

    const item = data.datos ?? data.data ?? data.incidencia ?? data;
    return this._mapIncidencia(item);
  },

  // 4. Registrar incidencia (POST /api/incidencias)
  async registrarIncidencia(nuevaIncidencia, usuarioNombre = 'Usuario') {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 800));

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
        estado: 'Abierto',
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

      list.unshift(createdItem);
      localStorage.setItem('hd_incidencias', JSON.stringify(list));

      return {
        success: true,
        message: 'Registro guardado exitosamente en base de datos MySQL (Simulado).',
        incidencia: createdItem
      };
    }

    // Petición real
    let userIdVal = 1;
    const sessionStr = localStorage.getItem('helpdesk_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.user && session.user.id) {
          userIdVal = session.user.id;
        }
      } catch (e) {
        console.error('Error al recuperar ID del usuario de la sesión:', e);
      }
    }

    // ESTRUCTURA EXACTA DEL POST api/incidencias PROPORCIONADA:
    // { "idUsuario": 2, "titulo": "...", "descripcion": "...", "categoria": 0, "prioridad": 0, "status": 0, "observaciones": "..." }
    const payloadReal = {
      idUsuario: userIdVal,
      titulo: nuevaIncidencia.asunto,
      descripcion: nuevaIncidencia.descripcion,
      categoria: this._mapCategoriaToBackend(nuevaIncidencia.categoria),
      prioridad: this._mapPrioridadToBackend(nuevaIncidencia.prioridad),
      status: this._mapEstadoToBackend('Abierto'), // 0 para Abierta
      observaciones: 'Incidencia creada desde el frontend.'
    };

    const data = await this._request('/api/incidencias', {
      method: 'POST',
      headers: this._getAuthHeaders(),
      body: JSON.stringify(payloadReal)
    });

    const item = data.datos ?? data.data ?? data.incidencia ?? data;
    return {
      success: true,
      message: data.message || data.mensaje || data.msg || 'Incidencia registrada con éxito',
      incidencia: this._mapIncidencia(item)
    };
  },

  // 5. Actualizar estado de incidencia (PUT /api/incidencias/{id}/estado)
  async actualizarEstado(id, nuevoEstado, observaciones, usuarioNombre = 'Administrador') {
    if (this.isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 600));

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

      if (incidencia.estado === 'Cerrado' && nuevoEstado !== 'Cerrado') {
        throw new Error('No se admiten cambios de estado en incidencias que ya han sido cerradas definitivamente.');
      }

      if (incidencia.estado === nuevoEstado) {
        throw new Error(`La incidencia ya se encuentra en estado "${nuevoEstado}". Selecciona un estado diferente.`);
      }

      if (incidencia.estado === 'Abierto' && nuevoEstado === 'Cerrado') {
        throw new Error('Transición de estado no permitida: No es posible cerrar una incidencia en estado "Abierto" directamente sin antes marcarla "En Proceso" para su revisión.');
      }

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

    // Petición real
    let userIdVal = 1;
    const sessionStr = localStorage.getItem('helpdesk_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.user && session.user.id) {
          userIdVal = session.user.id;
        }
      } catch (e) {}
    }

    // Traducir al formato esperado por el PUT del Swagger / API real:
    // status puede ser el texto ("Cerrada", "En_Proceso", "Abierta") o el entero del Enum según la API.
    // Usamos el texto como demostraste en tu ejemplo exitoso: { "status": "Cerrada", "observaciones": "..." }
    const estadoText = this._mapEstadoToBackendText(nuevoEstado);

    const payloadActualizacion = {
      status: estadoText,
      observaciones: observaciones
    };

    if (userIdVal) {
      const parsedUserId = parseInt(userIdVal, 10);
      if (!isNaN(parsedUserId)) {
        payloadActualizacion.idUsuario = parsedUserId;
      }
    }

    const data = await this._request(`/api/incidencias/${id}/estado`, {
      method: 'PUT',
      headers: this._getAuthHeaders(),
      body: JSON.stringify(payloadActualizacion)
    });

    const item = data.datos ?? data.data ?? data.incidencia ?? data;
    return {
      success: true,
      message: data.message || data.mensaje || data.msg || 'Estado actualizado con éxito',
      incidencia: this._mapIncidencia(item)
    };
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
