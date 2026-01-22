# todo-nestjs - NestJS API

[![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/ORM-TypeORM-fe0808?logo=typeorm&logoColor=white)](https://typeorm.io/)

---

## Tabla de Contenidos

1. Descripción
2. Requisitos Previos
3. Configuración del Proyecto
    * Instalación
    * Variables de Entorno
    * Base de Datos
4. Ejecución
5. Referencia de la API
6. Estructura de Módulos
7. Tecnologías Utilizadas
8. Autor

---

## Descripción

Este proyecto implementa el backend de una aplicación de lista de tareas (To-Do List), permitiendo el registro de usuarios y la asignación dinámica de tareas con persistencia de datos relacional.

---

## Requisitos Previos

Antes de configurar el proyecto, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

* **Node.js**: Versión **18.0.0** o superior.  
    *Puedes verificarlo con: `node -v` ó `node --version`*
* **PostgreSQL**: Motor de base de datos relacional (v14 o superior).
* **Gestor de paquetes**: **npm** (viene con Node.js).
* **Herramienta de Base de Datos**: 
    * **pgAdmin 4** (Recomendado para visualización).
    * Opcionalmente, extensión de VS Code: *PostgreSQL*.
* **Cliente API**: **Postman** para probar los endpoints.

---

## Configuración e Instalación

Sigue estos pasos para poner en marcha el entorno local:

### 1. Instalación
Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd todo-nestjs
```

Luego, descarga las dependencias del framework y los controladores necesarios para la base de datos:
```bash
# Instalar dependencias del núcleo
$ npm install

# Instalar dependencias de base de datos y configuración
$ npm install @nestjs/typeorm typeorm pg @nestjs/config

# Instalar dependencias de encriptación (JWT)
$ npm install @nestjs/passport passport @nestjs/jwt passport-jwt bcrypt
$ npm install -D @types/passport-jwt @types/bcrypt
```

### 2. Variables de entorno

Crea un archivo llamado .env en la raíz del proyecto. Este archivo es fundamental para que NestJS sepa cómo conectarse a PostgreSQL. Copia y adapta el siguiente contenido:
```bash
# Conexión a Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=todo_bdd
```

### 3. Base de Datos

El proyecto utiliza **PostgreSQL** como motor relacional. La estructura de las tablas se gestiona mediante el esquema de **Code First** (el código define la base de datos) a través de TypeORM.

Antes de iniciar la aplicación, debes asegurar que el servidor de PostgreSQL esté corriendo y crear la base de datos manualmente:

```sql
CREATE DATABASE todo_bdd;
```

---

## Ejecución

Una vez configurada la base de datos y el archivo `.env`, puedes iniciar el servidor:

```bash
# Modo desarrollo (con recarga automática al guardar cambios)
$ npm run start:dev
```

---

## Tecnologías Utilizadas

El proyecto está construido con un stack moderno enfocado en la robustez, el tipado fuerte y la escalabilidad:

* **[NestJS](https://nestjs.com/):** Framework de Node.js orientado a objetos para construir aplicaciones del lado del servidor eficientes y confiables.
* **[TypeScript](https://www.typescriptlang.org/):** Superconjunto de JavaScript que añade tipado estático, facilitando la detección de errores en desarrollo.
* **[PostgreSQL](https://www.postgresql.org/):** Sistema de gestión de bases de datos relacionales potente y de código abierto.
* **[TypeORM](https://typeorm.io/):** Object-Relational Mapper (ORM) que permite interactuar con la base de datos usando clases y decoradores de TypeScript.
* **[@nestjs/config](https://docs.nestjs.com/techniques/configuration):** Módulo oficial para la gestión de variables de entorno mediante archivos `.env`.
* **Class-Validator & Class-Transformer:** Librerías para asegurar que los datos que entran a la API (DTOs) cumplan con el formato y las reglas de negocio.

---

## Autor

Desarrollado por **Jeisi Rosales**.

Si tienes alguna duda sobre este proyecto o quieres conectar conmigo, puedes encontrarme en:

* **LinkedIn:** [Jeisi Rosales](https://linkedin.com/in/tu-perfil)
* **Email:** jeisirosales2003@gmail.com