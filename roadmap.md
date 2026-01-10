# Roadmap de Implementación MVP - Todo App

Este documento detalla el plan de implementación paso a paso para el MVP basado en el diagrama entidad-relación (ERD) proporcionado. El stack asumido es **NestJS** para el backend.

## Fase 1: Configuración Inicial y Base de Datos

El objetivo es tener el proyecto corriendo y conectado a una base de datos relacional.

- [x] **Inicialización del Proyecto**
    - [x] Crear proyecto con Nest CLI (`nest new`).
    - [x] Configurar variables de entorno (`.env`).
    - [x] Configurar control de versiones (Git init).
    - **Checkpoint**: El servidor levanta correctamente en `localhost:3000`.

- [x] **Configuración de Base de Datos (TypeORM / Prisma)**
    - [x] Instalar dependencias de ORM y driver de BD (ej. Postgres/MySQL).
    - [x] Configurar conexión asíncrona a la BD en `app.module`.
    - [x] Configurar Docker Compose para la BD (opcional pero recomendado).
    - **Checkpoint**: Conexión exitosa a la base de datos al iniciar la app.

## Fase 2: Módulo de Usuarios y Autenticación (Auth)

Implementación de la entidad `USER` y seguridad.

- [x] **Entidad User**
    - [x] Crear entidad/modelo `User` (`user_id`, `user_name`, `user_mail`, `user_password`).
    - [x] Crear migración/sincronización inicial.
    - **Checkpoint**: La tabla `USER` existe en la base de datos.

- [x] **Autenticación (JWT)**
    - [x] Implementar Hash de contraseñas (bcrypt).
    - [x] Crear endpoints: `POST /auth/register` y `POST /auth/login`.
    - [x] Implementar JWT Strategy y Guards.
    - **Checkpoint**:
        - [x] Se puede registrar un usuario y se guarda la password encriptada.
        - [x] Login devuelve un Token JWT válido.
        - [x] Un endpoint protegido rechaza peticiones sin token.

## Fase 3: Módulo de Categorías (Master Data)

Implementación de la entidad `CATEGORY` para clasificar tareas.

- [x] **Entidad Category**
    - [x] Crear entidad `Category` (`category_id`, `category_name`, `category_descrip`, `category_color`).
    - **Checkpoint**: La tabla `CATEGORY` existe en la base de datos.

- [x] **CRUD Categorías**
    - [x] `POST /categories`: Crear categoría.
    - [x] `GET /categories`: Listar todas.
    - [x] `PATCH /categories/:id`: Editar (color/nombre).
    - [x] `DELETE /categories/:id`: Eliminar.
    - **Checkpoint**: Se pueden crear categorías y verlas listadas.

## ✅ Fase 4: Módulo de Tareas (Core Business)

Implementación de la entidad `TASK` y sus relaciones.

- [x] **Entidad Task**
    - [x] Crear entidad `Task` con campos básicos.
    - [x] Relación Many-to-One con `User` (`task_creator`).
    - [x] Relación Many-to-One con `User` (`task_assign_to`).
    - [x] Relación Many-to-One con `Category` (`task_category`).
    - **Checkpoint**: Tabla `TASK` creada con todas las Foreign Keys (FK) correctas.

- [x] **CRUD Tareas Básicas**
    - [x] `POST /tasks`: Crear tarea (asignando creador automáticamente desde el token).
    - [x] `GET /tasks`: Listar tareas (con filtros básicos).
    - [x] `GET /tasks/:id`: Ver detalle.
    - [x] `PATCH /tasks/:id/status`: Cambiar estado (`task_status`).
    - **Checkpoint**: Un usuario puede crear una tarea asignada a otro usuario y categorizarla.

## 💬 Fase 5: Módulo de Comentarios

Implementación de la entidad `COMMENT` para comunicación en tareas.

- [ ] **Entidad Comment**
    - [ ] Crear entidad `Comment` (`comment_id`, `comment_content`, `comment_date`).
    - [ ] Relación Many-to-One con `Task` (`comment_from_task`).
    - [ ] Relación Many-to-One con `User` (`comment_creator`).
    - **Checkpoint**: Tabla `COMMENT` creada correctamente relacionada a tareas y usuarios.

- [ ] **Endpoints de Comentarios**
    - [ ] `POST /tasks/:taskId/comments`: Agregar comentario.
    - [ ] `GET /tasks/:taskId/comments`: Ver historial de la tarea.
    - **Checkpoint**: Se pueden agregar y leer comentarios dentro de una tarea específica.

## 🚀 Fase 6: Documentación y Refinamiento

- [ ] **Documentación API**
    - [ ] Configurar Swagger/OpenAPI (`@nestjs/swagger`).
    - [ ] Decorar DTOs y Controladores.
    - **Checkpoint**: Acceso a `/api/docs` muestra todos los endpoints probables.

- [ ] **Validaciones y Manejo de Errores**
    - [ ] Validar DTOs con `class-validator` (emails válidos, campos requeridos).
    - [ ] Asegurar que no se puedan borrar categorías si tienen tareas asignadas.
    - **Checkpoint**: Intentar enviar datos corruptos devuelve 400 Bad Request.
