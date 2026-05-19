# 📈 Progreso del Desarrollo - HelpDesk

Este archivo sirve para registrar el avance de las características y vistas por desarrollar en el proyecto **HelpDesk**. Utiliza este documento para marcar con `[x]` las tareas completadas y visualizar el estado actual del desarrollo.

---

## 🛠️ Fase 1: Configuración Inicial del Entorno
- [x] Inicializar proyecto de React con Vite.
- [x] Instalar y configurar Tailwind CSS v4 (usando `@tailwindcss/vite`).
- [x] Configurar tipografía corporativa (Outfit) y metaetiquetas SEO en `index.html`.
- [x] Crear el documento de contexto `PROJECT_CONTEXT.md` con los requerimientos generales.

---

## 🖥️ Fase 2: Plantilla Principal y Autenticación
- [ ] **Configurar Rutas de la Aplicación** (Configurar router o controlador de estado para alternar entre las diferentes vistas: Login, Dashboard, Registro, Listado, Acerca De).
- [ ] **Vistas de Autenticación (Login)**
  - [ ] Diseñar pantalla de Login formal y responsiva con Tailwind CSS.
  - [ ] Implementar campos de usuario y contraseña con validación del lado del cliente.
  - [ ] Implementar gestión de sesión activa (guardar/remover datos en `localStorage`).
- [ ] **Plantilla Principal (MasterPage / Navbar / Layout)**
  - [ ] Diseñar cabecera corporativa estática con logo del sistema.
  - [ ] Mostrar información del usuario autenticado (avatar, nombre, rol).
  - [ ] Implementar barra de navegación lateral o superior responsiva para cambiar de sección.
  - [ ] Agregar botón de cierre de sesión ("Logout").

---

## 📝 Fase 3: Registro y Gestión de Incidencias
- [ ] **Formulario de Registro de Incidencias**
  - [ ] Diseñar formulario formal con campos: Asunto, Categoría (Desplegable), Prioridad (Desplegable), Descripción.
  - [ ] Validaciones de campos requeridos antes del envío.
  - [ ] Botón de registro con estado de carga ("Enviando...").
- [ ] **Listado de Incidencias**
  - [ ] Diseñar panel contenedor responsivo para la consulta de datos.
  - [ ] Visualización de incidencias en tabla o rejilla de tarjetas formales.
  - [ ] Mostrar etiquetas de prioridad y badges de estado coloreados según el nivel:
    - *Abierto* (Verde / Emerald)
    - *En Proceso* (Amarillo / Amber)
    - *Cerrado* (Gris / Slate)
  - [ ] Agregar buscador local o filtrado de incidencias por estado.
- [ ] **Detalle y Actualización de Incidencias**
  - [ ] Vista ampliada de una incidencia (asunto, descripción detallada, fecha).
  - [ ] Sección de comentarios u observaciones históricas.
  - [ ] Selector interactivo para cambiar de estado (ej: pasar de *Abierto* a *En Proceso* o *Cerrado*).
  - [ ] Campo para capturar observaciones/comentarios al cambiar de estado.

---

## 🔗 Fase 4: Integración con la API (Consumo de Endpoints)
- [ ] Declarar variable global/entorno para la URL base del Backend (`VITE_API_BASE_URL` o constante de servicio).
- [ ] **Integrar API de Autenticación**
  - [ ] Consumir `POST /api/acceso/login` enviando credenciales de usuario.
- [ ] **Integrar API de Registro**
  - [ ] Consumir `POST /api/incidencias` para guardar nuevos registros en la base de datos MySQL.
- [ ] **Integrar API de Consultas**
  - [ ] Consumir `GET /api/incidencias` para poblar el listado principal.
  - [ ] Consumir `GET /api/incidencias/{id}` al seleccionar una incidencia individual.
- [ ] **Integrar API de Actualizaciones**
  - [ ] Consumir `PUT /api/incidencias/{id}/estado` para guardar las transiciones de estado e ingresar observaciones.

---

## 🧪 Fase 5: Pruebas y Control de Calidad
- [ ] **Validación de Credenciales**
  - [ ] **Prueba 1:** Verificar login exitoso -> Guarda sesión + Carga vista principal + Muestra bandera de éxito.
  - [ ] **Prueba 2:** Verificar login fallido -> Muestra mensaje controlado de error de acceso en interfaz.
- [ ] **Validación de Incidencias**
  - [ ] **Prueba 3:** Verificar registro exitoso -> Muestra bandera de confirmación de guardado en MySQL.
  - [ ] **Prueba 4:** Verificar consulta exitosa -> Muestra la respuesta en formato JSON formateado en pantalla.
  - [ ] **Prueba 5:** Verificar actualización de estado -> Cambio guardado y reflejado en el listado.
  - [ ] **Prueba 6:** Verificar error por estado inválido -> Muestra bandera con error controlado del API sin cambiar la información local.

---

## 👥 Vista Informativa
- [ ] **Página "Acerca De"**
  - [ ] Diseñar panel con las fotos, nombres y datos académicos del equipo de desarrollo.
