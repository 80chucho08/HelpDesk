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

  /**
   * Helper para traducir estados del Frontend (masculino/espacio) al Backend (femenino/guion bajo esperado por la DB)
   */
  _mapEstadoToBackend(estado) {
    if (!estado) return 'Abierta';
    const est = String(estado).trim();
    if (est === 'Abierto' || est === 'Abierta') return 'Abierta';
    if (est === 'Cerrado' || est === 'Cerrada') return 'Cerrada';
    if (est === 'En Proceso' || est === 'En_Proceso' || est === 'En_proceso' || est === 'En proceso') return 'En_Proceso';
    return est;
  },

  /**
   * Helper para traducir estados del Backend (femenino/guion bajo) al Frontend (masculino/espacio usado en UI de React)
   */
  _mapEstadoToFrontend(estado) {
    if (!estado) return 'Abierto';
    const est = String(estado).trim();
    if (est === 'Abierta' || est === 'Abierto') return 'Abierto';
    if (est === 'Cerrada' || est === 'Cerrado') return 'Cerrado';
    if (est === 'En_Proceso' || est === 'En_proceso' || est === 'En Proceso' || est === 'En proceso') return 'En Proceso';
    return est;
  },

  /**
   * Helper para extraer un Array de incidencias de forma flexible de cualquier
   * estructura de respuesta del Backend (por ejemplo, encapsuladas en 'datos' o 'data')
   */
  _extractArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // Buscar en propiedades de respuesta comunes
    const target = data.datos ?? data.data ?? data.items ?? data.list ?? data.incidencias;
    if (Array.isArray(target)) return target;

    // Si target es un objeto, escanear si tiene algún array adentro
    if (target && typeof target === 'object') {
      if (Array.isArray(target.incidencias)) return target.incidencias;
      if (Array.isArray(target.items)) return target.items;
      if (Array.isArray(target.data)) return target.data;
      if (Array.isArray(target.list)) return target.list;

      // Buscar el primer array que contenga el objeto target
      for (const key in target) {
        if (Array.isArray(target[key])) {
          return target[key];
        }
      }

      // Si target representa una incidencia única
      if (target.id || target.id_incidencia || target.asunto) {
        return [target];
      }
    }

    // Buscar en la raíz de 'data' si hay algún array
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }

    // Si data en sí representa un objeto individual
    if (typeof data === 'object') {
      if (data.id || data.id_incidencia || data.asunto) {
        return [data];
      }
    }

    return [];
  },

  /**
   * Helper de traducción para normalizar las propiedades del Backend
   * a campos estandarizados del Frontend de React.
   */
  _mapIncidencia(rawItem) {
    if (!rawItem) return null;

    // Normalizar ID
    const idVal = rawItem.id ?? rawItem.id_incidencia ?? rawItem.idIncidencia ?? rawItem.id_incidencias ?? rawItem.folio ?? '';
    const id = idVal !== '' ? String(idVal) : 'INC-000';

    // Campos primarios
    const asunto = rawItem.asunto ?? rawItem.titulo ?? rawItem.nombre ?? rawItem.issue ?? rawItem.subject ?? 'Sin Asunto';
    const categoria = rawItem.categoria ?? rawItem.category ?? rawItem.tipo ?? rawItem.area ?? 'Otros';
    const prioridad = rawItem.prioridad ?? rawItem.priority ?? rawItem.nivel ?? 'Baja';
    
    // Normalizar el estado al género masculino para que funcione con el CSS y los selects
    const rawEstado = rawItem.estado ?? rawItem.status ?? rawItem.id_estado ?? rawItem.state ?? 'Abierto';
    const estado = this._mapEstadoToFrontend(rawEstado);
    
    const descripcion = rawItem.descripcion ?? rawItem.description ?? rawItem.detalle ?? rawItem.mensaje ?? 'Sin Descripción';
    
    // Metadatos
    const fechaCreacion = rawItem.fechaCreacion ?? rawItem.fecha_creacion ?? rawItem.fecha ?? rawItem.creado_el ?? rawItem.createdAt ?? new Date().toISOString();
    const creador = rawItem.creador ?? rawItem.usuario ?? rawItem.reporta ?? rawItem.nombreUsuario ?? rawItem.creadoPor ?? rawItem.createdBy ?? 'Usuario';
    const observaciones = rawItem.observaciones ?? rawItem.comentarios ?? rawItem.observacion ?? rawItem.comments ?? '';

    // Historial / Auditoría de Cambios
    const rawHistorial = rawItem.historial ?? rawItem.logs ?? rawItem.historial_estados ?? rawItem.movimientos;
    let historial = [];
    if (Array.isArray(rawHistorial)) {
      historial = rawHistorial.map(h => ({
        fecha: h.fecha ?? h.createdAt ?? h.fecha_movimiento ?? new Date().toISOString(),
        estado: this._mapEstadoToFrontend(h.estado ?? h.status ?? 'Abierto'),
        observacion: h.observacion ?? h.observaciones ?? h.comentario ?? 'Cambio registrado',
        usuario: h.usuario ?? h.nombreUsuario ?? h.creadoPor ?? 'Usuario'
      }));
    } else {
      // Generar historial implícito para evitar fallas en UI
      historial = [
        {
          fecha: fechaCreacion,
          estado: 'Abierto',
          observacion: observaciones || 'Incidencia registrada en el sistema.',
          usuario: creador
        }
      ];
      // Si ya está en otro estado, simular la transición inicial
      if (estado !== 'Abierto') {
        historial.push({
          fecha: new Date(fechaCreacion).getTime() + 60000 < Date.now() ? new Date(new Date(fechaCreacion).getTime() + 60000).toISOString() : new Date().toISOString(),
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

    // Comprobar indicadores de éxito lógicos del Backend (incluso si responde con HTTP Status 200 OK)
    const isSuccess = data.statusExec === true || data.statusExec === 1 || data.success === true || data.flag === 1 || data.flag === true;
    if (!isSuccess) {
      throw new Error(data.msg || data.message || data.mensaje || 'Usuario o contraseña incorrectos.');
    }

    // Extraer datos del usuario de forma flexible (incluyendo 'datos' devuelto por el backend)
    const rawUser = data.datos || data.user || data.usuario || data.data || data;
    const extractedToken = data.token || data.accessToken || data.jwt || data.tokenAcceso || data.token_acceso || '';

    // Mapear campos para asegurar compatibilidad con la UI de React
    const mappedUser = {
      id: rawUser.id || rawUser.idUsuario || rawUser.id_usuario || 1,
      name: rawUser.name || rawUser.nombre || rawUser.nombreUsuario || rawUser.fullName || rawUser.email || rawUser.correo || 'Usuario',
      email: rawUser.email || rawUser.correo || email,
      role: rawUser.role || rawUser.rol || rawUser.perfil || 'Usuario',
      avatar: rawUser.avatar || rawUser.foto || rawUser.imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUser.name || rawUser.nombre || 'Usuario')}&background=8b5cf6&color=fff`
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

    // Petición real
    const data = await this._request('/api/incidencias', {
      headers: this._getAuthHeaders()
    });

    // Extraer incidencias y normalizarlas
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

    // Petición real
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

    // Traducir el estado inicial al formato del Backend
    const initialStatus = this._mapEstadoToBackend('Abierto');

    // Inyectamos múltiples variantes de propiedades para evitar fallas por nomenclatura en la BD (camelCase, snake_case y PascalCase)
    const payloadCompleto = {
      // Título / Asunto
      asunto: nuevaIncidencia.asunto,
      Asunto: nuevaIncidencia.asunto,
      titulo: nuevaIncidencia.asunto,
      Titulo: nuevaIncidencia.asunto,
      title: nuevaIncidencia.asunto,
      Title: nuevaIncidencia.asunto,
      subject: nuevaIncidencia.asunto,
      Subject: nuevaIncidencia.asunto,

      // Descripción / Detalle
      descripcion: nuevaIncidencia.descripcion,
      Descripcion: nuevaIncidencia.descripcion,
      description: nuevaIncidencia.descripcion,
      Description: nuevaIncidencia.descripcion,
      detalle: nuevaIncidencia.descripcion,
      Detalle: nuevaIncidencia.descripcion,

      // Categoría / Área
      categoria: nuevaIncidencia.categoria,
      Categoria: nuevaIncidencia.categoria,
      category: nuevaIncidencia.categoria,
      Category: nuevaIncidencia.categoria,
      tipo: nuevaIncidencia.categoria,
      Tipo: nuevaIncidencia.categoria,

      // Prioridad / Nivel
      prioridad: nuevaIncidencia.prioridad,
      Prioridad: nuevaIncidencia.prioridad,
      priority: nuevaIncidencia.prioridad,
      Priority: nuevaIncidencia.prioridad,
      nivel: nuevaIncidencia.prioridad,
      Nivel: nuevaIncidencia.prioridad,

      // Estado / Status inicial traducido
      estado: initialStatus,
      Estado: initialStatus,
      status: initialStatus,
      Status: initialStatus,
      state: initialStatus,
      State: initialStatus,

      // IDs de usuario vinculados
      idUsuario: userIdVal,
      IdUsuario: userIdVal,
      id_usuario: userIdVal,
      usuarioId: userIdVal,
      UsuarioId: userIdVal,
      userId: userIdVal,
      UserId: userIdVal,
      idCreador: userIdVal,
      IdCreador: userIdVal,
      creadorId: userIdVal,
      CreadorId: userIdVal,
      creador: usuarioNombre,
      Creador: usuarioNombre,
      usuario: usuarioNombre,
      Usuario: usuarioNombre
    };

    const data = await this._request('/api/incidencias', {
      method: 'POST',
      headers: this._getAuthHeaders(),
      body: JSON.stringify(payloadCompleto)
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

    // Traducir el nuevo estado al género y formato del Backend (ej. "Cerrado" -> "Cerrada")
    const estadoBackend = this._mapEstadoToBackend(nuevoEstado);

    // Inyectamos múltiples variantes de propiedad para el estado, observaciones e identificadores (camelCase, snake_case y PascalCase)
    const payloadActualizacion = {
      // Identificadores de la incidencia
      id: id,
      Id: id,
      idIncidencia: id,
      IdIncidencia: id,
      id_incidencia: id,
      folio: id,
      Folio: id,

      // Estado / Status (mapeado al formato que el backend espera)
      estado: estadoBackend,
      Estado: estadoBackend,
      nuevoEstado: estadoBackend,
      NuevoEstado: estadoBackend,
      nuevo_estado: estadoBackend,
      status: estadoBackend,
      Status: estadoBackend,
      state: estadoBackend,
      State: estadoBackend,
      nuevoStatus: estadoBackend,
      NuevoStatus: estadoBackend,
      nuevo_status: estadoBackend,

      // Observaciones / Comentarios
      observaciones: observaciones,
      Observaciones: observaciones,
      observacion: observaciones,
      Observacion: observaciones,
      comentario: observaciones,
      Comentario: observaciones,
      comentarios: observaciones,
      Comentarios: observaciones,
      nota: observaciones,
      Nota: observaciones,
      notas: observaciones,
      Notas: observaciones,
      justificacion: observaciones,
      Justificacion: observaciones,

      // IDs de usuario operador/actualizador
      idUsuario: userIdVal,
      IdUsuario: userIdVal,
      id_usuario: userIdVal,
      usuarioId: userIdVal,
      UsuarioId: userIdVal,
      userId: userIdVal,
      UserId: userIdVal,
      idOperador: userIdVal,
      IdOperador: userIdVal,
      operadorId: userIdVal,
      OperadorId: userIdVal
    };

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
