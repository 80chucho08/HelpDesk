# 🖥️ HelpDesk - Sistema de Gestión de Incidencias

HelpDesk es una plataforma web moderna y responsiva diseñada para el reporte, seguimiento y gestión de incidencias de soporte técnico interno. Este repositorio aloja el **Frontend** de la aplicación, desarrollado con una estética profesional premium y optimizado para integrarse con un backend local seguro (ASP.NET Core / MySQL).

---

## 🚀 Características Principales

1. **🔒 Autenticación Segura (Login)**
   * Formulario con validaciones formales en tiempo real.
   * Gestión de sesión activa (JWT Token) persistida de forma segura.
   * Carga dinámica de perfiles de usuario (Nombre, Rol, Email y Avatar autogenerado).

2. **📊 Panel Principal (Dashboard)**
   * Listado interactivo de incidencias con búsqueda por asunto o creador.
   * Filtros rápidos por estado de incidencia (`Todos`, `Abierto`, `En Proceso`, `Cerrado`).
   * Tarjetas visuales con indicadores de categoría y badges de prioridad coloreados.

3. **🔍 Visor Detallado y Historial de Auditoría**
   * Panel lateral expansible al seleccionar cualquier incidencia.
   * Línea de tiempo cronológica con el historial de movimientos de la incidencia.
   * Pestaña interactiva con **Visor JSON** para inspeccionar la respuesta cruda recibida de la API.

4. **📝 Registro de Incidencias**
   * Formulario completo con validación de campos obligatorios.
   * Mapeo transparente de inputs de texto a Enums numéricos de Base de Datos.

5. **🔄 Actualización Dinámica de Estados**
   * Formulario de cambio de estado protegido con reglas lógicas de negocio (ej. observaciones obligatorias, restricciones de cierres directos).

6. **⚡ Modo Demo / Simulador Integrado**
   * Interruptor visual en la interfaz que permite alternar en caliente entre **Llamadas Reales a la API** y un **Simulador Local** impulsado por `localStorage`. Excelente para validar la UI sin depender de la base de datos local.

---

## 🛠️ Tecnologías y Arquitectura

* **Core:** React 19 & JavaScript (ES6+).
* **Herramienta de Construcción:** Vite 8 (HMR ultra veloz).
* **Estilos (CSS):** Tailwind CSS v4 con diseño premium adaptativo, soporte de tema oscuro automático, efectos de desenfoque (*glassmorphic login*), transiciones micro-animadas y fuentes tipográficas optimizadas.
* **Iconografía:** Lucide React.
* **Componentes Custom:** Sistema de notificaciones flotantes (Toast Banners) para alertas y confirmaciones visuales de éxito/error.

---

## 📦 Instalación y Configuración

### Prerrequisitos
* Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### Paso 1: Clonar el proyecto e instalar dependencias
```bash
# Instalar los paquetes necesarios
npm install
```

### Paso 2: Configurar las variables de entorno (Evitar CORS)
El proyecto incluye un proxy inverso integrado en el servidor de desarrollo de Vite. Para activarlo y evitar errores de CORS (Cross-Origin Resource Sharing) en tu navegador:

1. Abre el archivo `.env` en la raíz del proyecto.
2. Asegúrate de configurar `VITE_API_PROXY_TARGET` con la dirección de tu backend real y deja `VITE_API_BASE_URL` en blanco (vacío):

```env
# Deja VITE_API_BASE_URL vacío para usar el proxy inverso de Vite (evita CORS)
VITE_API_BASE_URL=

# URL real del backend donde el proxy de Vite redirigirá las peticiones
VITE_API_PROXY_TARGET=https://localhost:44365
```
*(Nota: El proxy de desarrollo está configurado en `vite.config.js` con `secure: false` para omitir la validación de certificados SSL auto-firmados en localhost HTTPS).*

### Paso 3: Ejecutar el servidor de desarrollo
```bash
# Iniciar el servidor local
npm run dev
```
Abre en tu navegador la dirección indicada por la consola (normalmente `http://localhost:5173`).

---

## 🔌 Consumo de API & Endpoints

La aplicación se comunica con el backend mediante las siguientes rutas:

| Método | Endpoint | Cuerpo (Request Body) / Propósito |
| :--- | :--- | :--- |
| **POST** | `/api/acceso/login` | `{ "email": "...", "password": "..." }` <br> Valida acceso y devuelve token + usuario. |
| **GET** | `/api/incidencias` | Obtiene el listado completo de reportes registrados. |
| **GET** | `/api/incidencias/{id}` | Obtiene los detalles y movimientos de una incidencia por su ID. |
| **POST** | `/api/incidencias` | `{ "idUsuario": 16, "titulo": "...", "descripcion": "...", "categoria": 0, "prioridad": 1, "status": 0 }` <br> Registra un reporte. |
| **PUT** | `/api/incidencias/{id}/estado` | `{ "status": "En_Proceso", "observaciones": "..." }` <br> Actualiza el estado del reporte. |

---

## 🧪 Casos de Prueba Listos para Ejecutar

El proyecto cumple con las siguientes pruebas de verificación (disponibles tanto en modo API Real como en Modo Demo):
1. **Prueba 1 (Login Correcto):** Ingreso exitoso y redirección al Dashboard.
2. **Prueba 2 (Login Incorrecto):** Captura de credenciales inválidas con bandera de alerta controlada.
3. **Prueba 3 (Registro de Reporte):** Guardado exitoso de incidencias mapeando prioridades y categorías.
4. **Prueba 4 (Consulta e Inspección):** Listado y renderizado dinámico de la lista de incidencias con visor JSON.
5. **Prueba 5 (Actualización):** Cambio de estado exitoso que se refleja inmediatamente en el Dashboard.
6. **Prueba 6 (Errores de Transición):** Bloqueo de cambios inválidos o vacíos con notificaciones toast informativas.
