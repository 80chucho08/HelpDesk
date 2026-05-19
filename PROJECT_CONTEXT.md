# Contexto y Requerimientos del Proyecto: HelpDesk

Este documento establece las especificaciones, requerimientos funcionales, flujos de navegación y la interacción con la API para el desarrollo del frontend de la aplicación **HelpDesk**.

---

## 🚀 Páginas y Procesos Mínimos Viables

La aplicación debe estructurarse bajo un diseño formal, profesional y responsivo utilizando las siguientes vistas:

1. **Login de Usuario**
   * Validación formal de credenciales de acceso.
   * Gestión de sesión activa en el cliente (ej. Token/Sesión en `localStorage` o Contexto de React).

2. **MasterPage o Plantilla Principal**
   * Diseño estructurado y corporativo.
   * Menú de navegación accesible para las diferentes secciones.
   * Barra superior con información del usuario autenticado y opción de cerrar sesión.

3. **Registro de Incidencias**
   * Formulario para reportar incidentes con campos clave (ej. asunto, descripción, categoría, prioridad).

4. **Listado de Incidencias**
   * Tabla o cuadrícula interactiva con la información de los reportes.
   * El estado de cada incidencia (`Abierto`, `En Proceso`, `Resuelto`, `Cerrado`) debe ser plenamente visible y distinguible por colores.

5. **Actualización de Estado**
   * Botón o selector interactivo dentro del detalle o listado de la incidencia para actualizar su estado y añadir observaciones.

6. **Página "Acerca De"**
   * Sección formal con la información y datos académicos del equipo de desarrollo.

---

## 🔌 Interacción con la API

Cada una de las operaciones principales de la interfaz debe consumir los endpoints provistos por el backend y manejar las respuestas de forma comprensible para el usuario (mensajes de éxito, advertencias y control de errores de red).

### Configuración del Backend
> [!NOTE]
> El backend se encuentra en fase de desarrollo. El frontend debe definir una variable global o de entorno para cambiar la URL base de forma sencilla.

* **Variable de Entorno Recomendada:** `VITE_API_BASE_URL` (en archivo `.env`)
* **URL Base de Reserva:** `http://localhost:8080` (o el puerto configurado en el backend)

### Endpoints a Consumir

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **POST** | `/api/acceso/login` | Valida credenciales, inicia sesión y devuelve los datos del usuario. |
| **POST** | `/api/incidencias` | Registra una nueva incidencia en la base de datos (MySQL). |
| **GET** | `/api/incidencias` | Obtiene el listado completo de incidencias registradas. |
| **GET** | `/api/incidencias/{id}` | Obtiene los detalles específicos de una incidencia por su ID. |
| **PUT** | `/api/incidencias/{id}/estado` | Actualiza el estado actual de la incidencia y guarda observaciones adicionales. |

---

## 🧪 Casos de Prueba Requeridos

La aplicación debe estar preparada para responder adecuadamente a los siguientes escenarios de prueba:

### 1. Autenticación

#### Prueba 1: Login Correcto
* **Comportamiento:** El usuario ingresa credenciales válidas.
* **Resultado:** Se muestra una bandera (indicador visual) de éxito y la interfaz carga los datos básicos del usuario en la plantilla principal.

#### Prueba 2: Login Incorrecto
* **Comportamiento:** El usuario ingresa credenciales inválidas.
* **Resultado:** Se muestra una bandera de error con un mensaje controlado y descriptivo (ej. *"Usuario o contraseña incorrectos"*).

### 2. Gestión de Incidencias

#### Prueba 3: Registrar Incidencia
* **Comportamiento:** Se completa el formulario de registro y se envía.
* **Resultado:** Se muestra una bandera de confirmación indicando que el registro ha sido guardado exitosamente en la base de datos (MySQL).

#### Prueba 4: Consultar Incidencias
* **Comportamiento:** Se accede a la vista de listado de incidencias.
* **Resultado:** La interfaz consume la lista en formato JSON y renderiza dinámicamente las incidencias en el listado.

#### Prueba 5: Actualizar Estado
* **Comportamiento:** Se modifica el estado de una incidencia desde el selector de actualización.
* **Resultado:** Se muestra una bandera de éxito y se refleja el nuevo estado automáticamente al realizar una consulta posterior.

#### Prueba 6: Validar Error de Estado Inválido
* **Comportamiento:** Se intenta realizar una transición de estado no permitida o con parámetros vacíos.
* **Resultado:** Se captura el error del backend, se muestra una bandera de error con el mensaje controlado, y los datos locales de la incidencia permanecen intactos sin modificaciones.
