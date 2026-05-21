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
- [x] **Configurar Rutas de la Aplicación** (Configurar router o controlador de estado para alternar entre las diferentes vistas: Login, Dashboard, Registro, Listado, Acerca De).
- [x] **Vistas de Autenticación (Login)**
  - [x] Diseñar pantalla de Login formal y responsiva con Tailwind CSS.
  - [x] Implementar campos de usuario y contraseña con validación del lado del cliente.
  - [x] Implementar gestión de sesión activa (guardar/remover datos en `localStorage`).
- [x] **Plantilla Principal (MasterPage / Navbar / Layout)**
  - [x] Diseñar cabecera corporativa estática con logo del sistema.
  - [x] Mostrar información del usuario autenticado (avatar, nombre, rol).
  - [x] Implementar barra de navegación lateral o superior responsiva para cambiar de sección.
  - [x] Agregar botón de cierre de sesión ("Logout").

---

## 📝 Fase 3: Registro y Gestión de Incidencias
- [x] **Formulario de Registro de Incidencias**
  - [x] Diseñar formulario formal con campos: Asunto, Categoría (Desplegable), Prioridad (Desplegable), Descripción.
  - [x] Validaciones de campos requeridos antes del envío.
  - [x] Botón de registro con estado de carga ("Enviando...").
- [x] **Listado de Incidencias**
  - [x] Diseñar panel contenedor responsivo para la consulta de datos.
  - [x] Visualización de incidencias en tabla o rejilla de tarjetas formales.
  - [x] Mostrar etiquetas de prioridad y badges de estado coloreados según el nivel:
    - *Abierto* (Verde / Emerald)
    - *En Proceso* (Amarillo / Amber)
    - *Cerrado* (Gris / Slate)
  - [x] Agregar buscador local o filtrado de incidencias por estado.
- [x] **Detalle y Actualización de Incidencias**
  - [x] Vista ampliada de una incidencia (asunto, descripción detallada, fecha).
  - [x] Sección de comentarios u observaciones históricas.
  - [x] Selector interactivo para cambiar de estado (ej: pasar de *Abierto* a *En Proceso* o *Cerrado*).
  - [x] Campo para capturar observaciones/comentarios al cambiar de estado.

---

## 🔗 Fase 4: Integración con la API (Consumo de Endpoints)
- [x] Declarar variable global/entorno para la URL base del Backend (`VITE_API_BASE_URL` o constante de servicio).
- [x] **Integrar API de Autenticación**
  - [x] Consumir `POST /api/acceso/login` enviando credenciales de usuario.
- [x] **Integrar API de Registro**
  - [x] Consumir `POST /api/incidencias` para guardar nuevos registros en la base de datos MySQL.
- [x] **Integrar API de Consultas**
  - [x] Consumir `GET /api/incidencias` para poblar el listado principal.
  - [x] Consumir `GET /api/incidencias/{id}` al seleccionar una incidencia individual.
- [x] **Integrar API de Actualizaciones**
  - [x] Consumir `PUT /api/incidencias/{id}/estado` para guardar las transiciones de estado e ingresar observaciones.

---

## 🧪 Fase 5: Pruebas y Control de Calidad
- [x] **Validación de Credenciales**
  - [x] **Prueba 1:** Verificar login exitoso -> Guarda sesión + Carga vista principal + Muestra bandera de éxito.
  - [x] **Prueba 2:** Verificar login fallido -> Muestra mensaje controlado de error de acceso en interfaz.
- [x] **Validación de Incidencias**
  - [x] **Prueba 3:** Verificar registro exitoso -> Muestra bandera de confirmación de guardado en MySQL.
  - [x] **Prueba 4:** Verificar consulta exitosa -> Muestra la respuesta en formato JSON formateado en pantalla.
  - [x] **Prueba 5:** Verificar actualización de estado -> Cambio guardado y reflejado en el listado.
  - [x] **Prueba 6:** Verificar error por estado inválido -> Muestra bandera con error controlado del API sin cambiar la información local.

---

## 👥 Vista Informativa
- [x] **Página "Acerca De"**
  - [x] Diseñar panel con las fotos, nombres y datos académicos del equipo de desarrollo.
