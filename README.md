# TaskFlow - Sistema de Gestión de Tareas

TaskFlow es una aplicación web full-stack diseñada para la gestión eficiente de tareas y colaboración. Este proyecto ofrece una solución robusta para organizar el flujo de trabajo diario, permitiendo a los usuarios mantener un control total sobre sus actividades y las de su equipo.

## 🚀 Descripción

El proyecto consiste en una plataforma que permite a los usuarios:
- Gestionar tareas con estados dinámicos.
- Clasificar actividades mediante categorías personalizables por color.
- Colaborar a través de un sistema de comentarios integrados en cada tarea.
- Visualizar el progreso de forma intuitiva con una interfaz moderna y minimalista.

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT (JSON Web Tokens) con Passport.js
- **Seguridad**: Bcrypt para el manejo de contraseñas seguras.

### Frontend
- **Framework**: [React 19](https://react.dev/) (Vite)
- **Lenguaje**: JavaScript
- **Estado y Navegación**: React Router DOM
- **Validación de Datos**: Zod + React Hook Form
- **Estilos**: Vanilla CSS moderno con diseño responsivo.
- **Iconografía**: Lucide React

## 📋 Funcionalidades principales

- **Autenticación**: Registro y login de usuarios con protección de rutas mediante JWT.
- **Gestión de Tareas (CRUD)**: Creación, lectura, edición y eliminación de tareas.
- **Estados de Tarea**: Transiciones suaves entre *Pending*, *In Progress*, *Completed* y *Cancelled*.
- **Gestión de Categorías**: Organización personalizada para agrupar tareas relacionadas.
- **Sistema de Comentarios**: Interacción directa en las tareas para añadir notas o feedback.
- **Interfaz Premium**: Diseño visualmente atractivo con transiciones y micro-animaciones.

## ⚙️ Instalación y Configuración

### Requisitos previos
- **Node.js**: Versión 18.0 o superior.
- **PostgreSQL**: Una instancia de base de datos activa.

### 🔌 Backend (`todo-nestjs`)

1. Clonar el repositorio.
2. Acceder al directorio: `cd todo-nestjs`
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Configurar el archivo `.env` en la raíz de la carpeta con las siguientes variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=taskflow_db
   JWT_SECRET=un_secreto_muy_seguro
   ```
5. Iniciar el servidor:
   ```bash
   npm run start:dev
   ```

### 💻 Frontend (`taskflow-frontend`)

1. Acceder al directorio: `cd taskflow-frontend`
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo `.env` con la URL de la API:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## 📦 Dependencias Principales

### Backend
- `@nestjs/common`, `@nestjs/core`, `@nestjs/jwt`, `@nestjs/passport`
- `@nestjs/typeorm`, `typeorm`, `pg`
- `bcrypt`, `class-validator`, `class-transformer`

### Frontend
- `react`, `react-dom`, `react-router-dom`
- `axios` (Cliente HTTP)
- `lucide-react` (Iconos)
- `date-fns` (Manejo de fechas)
- `zod`, `react-hook-form` (Validación y formularios)

## 👤 Desarrollado por **Jeisi Rosales**.

Si tienes alguna duda sobre este proyecto o quieres conectar conmigo, puedes encontrarme en:

* **LinkedIn:** [Jeisi Rosales](https://linkedin.com/in/tu-perfil)
* **Email:** jeisirosales2003@gmail.com

---
Este proyecto fue desarrollado con el objetivo de demostrar habilidades en el desarrollo de aplicaciones full-stack modernas, priorizando la experiencia de usuario y la escalabilidad del código.
