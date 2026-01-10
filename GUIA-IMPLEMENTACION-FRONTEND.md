# 🎨 Guía de Implementación del Frontend - TaskFlow

## 📋 Tabla de Contenidos

1. [Descripción del Diseño](#descripción-del-diseño)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Configuración Inicial del Proyecto](#configuración-inicial-del-proyecto)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Sistema de Diseño y Estilos](#sistema-de-diseño-y-estilos)
6. [Componentes Principales](#componentes-principales)
7. [Integración con el Backend](#integración-con-el-backend)
8. [Rutas y Navegación](#rutas-y-navegación)
9. [Guía de Implementación Paso a Paso](#guía-de-implementación-paso-a-paso)
10. [Referencias de Diseño](#referencias-de-diseño)

---

## 🎯 Descripción del Diseño

El diseño de **TaskFlow** es una aplicación moderna de gestión de tareas con las siguientes características visuales:

### Características del Diseño

- **Tema Oscuro** (Dark Mode) como tema principal
- **Sidebar de Navegación** con logo y opciones de menú
- **Interfaz de Tarjetas** para mostrar tareas
- **Modales Elegantes** para crear/editar tareas y categorías
- **Sistema de Colores** vibrante para categorías
- **Badges de Estado** para visualizar el progreso de tareas
- **Tipografía Clara** y moderna
- **Iconografía Consistente**

### Pantallas Principales

1. **Vista de Tareas (My Tasks)**
   - Grid de tarjetas de tareas
   - Información: título, descripción, fecha, categoría, estado
   - Botón "New Task" prominente

2. **Modal Crear Tarea**
   - Campos: título, descripción, categoría, fecha de entrega
   - Botones: Cancel y Create Task

3. **Modal Editar Tarea**
   - Mismos campos que crear
   - Pre-poblado con datos existentes
   - Botones: Cancel y Save Changes

4. **Vista de Categorías**
   - Grid de tarjetas de categorías con colores
   - Modal para crear categorías
   - Selector de colores visual

---

## 🛠️ Stack Tecnológico

### Opción 1: React + Vite (Recomendado)

```bash
Frontend Framework: React 18+
Build Tool: Vite
Routing: React Router DOM v6
State Management: React Context API + Hooks
HTTP Client: Axios
Styling: CSS Modules + CSS Variables
Icons: Lucide React
Date Handling: date-fns
Form Validation: React Hook Form + Zod
```

### Opción 2: Next.js

```bash
Framework: Next.js 14+ (App Router)
Routing: Next.js Built-in
State Management: React Context API
HTTP Client: Axios
Styling: CSS Modules
UI Components: Radix UI (opcional)
```

---

## 🏗️ Configuración Inicial del Proyecto

### Paso 1: Crear el Proyecto (Vite + React)

```bash
# Navegar a la carpeta del proyecto
cd "c:/Users/Jeisi Rosales/Documents/ToDo List"

# Crear proyecto frontend
npm create vite@latest taskflow-frontend -- --template react

# Entrar al directorio
cd taskflow-frontend

# Instalar dependencias
npm install
```

### Paso 2: Instalar Dependencias Adicionales

```bash
# Routing
npm install react-router-dom

# HTTP Client
npm install axios

# Forms y Validación
npm install react-hook-form zod @hookform/resolvers

# Utilidades
npm install date-fns

# Iconos
npm install lucide-react

# Notificaciones (opcional)
npm install react-hot-toast
```

### Paso 3: Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
```

---

## 📁 Estructura de Directorios

```
taskflow-frontend/
├── public/
│   └── taskflow-logo.svg
├── src/
│   ├── api/                      # Configuración de Axios y servicios
│   │   ├── axios.config.js
│   │   ├── auth.service.js
│   │   ├── tasks.service.js
│   │   ├── categories.service.js
│   │   └── comments.service.js
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── CreateTaskModal.jsx
│   │   │   └── EditTaskModal.jsx
│   │   ├── categories/
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── CategoryList.jsx
│   │   │   └── CreateCategoryModal.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   └── Badge.jsx
│   │   └── auth/
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   │
│   ├── context/                  # Context API para estado global
│   │   ├── AuthContext.jsx
│   │   └── TaskContext.jsx
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   └── useCategories.js
│   │
│   ├── pages/                    # Páginas de la aplicación
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TasksPage.jsx
│   │   └── CategoriesPage.jsx
│   │
│   ├── styles/                   # Estilos globales y CSS Modules
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── reset.css
│   │   └── components/
│   │       ├── sidebar.module.css
│   │       ├── taskCard.module.css
│   │       ├── modal.module.css
│   │       └── ...
│   │
│   ├── utils/                    # Utilidades
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── App.jsx                   # Componente raíz
│   ├── main.jsx                  # Punto de entrada
│   └── router.jsx                # Configuración de rutas
│
├── .env                          # Variables de entorno
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Sistema de Diseño y Estilos

### Variables CSS (src/styles/variables.css)

```css
:root {
  /* Colores Base */
  --color-background: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-surface-hover: #222222;
  --color-border: #2a2a2a;
  
  /* Colores de Texto */
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #666666;
  
  /* Colores de Acento */
  --color-primary: #5B7FFF;
  --color-primary-hover: #4869E6;
  --color-primary-light: rgba(91, 127, 255, 0.1);
  
  /* Estados de Tareas */
  --color-status-pending: #FFA500;
  --color-status-in-progress: #5B7FFF;
  --color-status-completed: #10B981;
  --color-status-cancelled: #EF4444;
  
  /* Colores de Categorías (por defecto) */
  --color-work: #5B7FFF;
  --color-personal: #EC4899;
  --color-urgent: #EF4444;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  /* Bordes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Espaciado */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Tipografía */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  
  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### CSS Reset (src/styles/reset.css)

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}
```

### Estilos Globales (src/styles/global.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import './variables.css';
@import './reset.css';

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

/* Animaciones globales */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes modalOpen {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in {
  animation: fadeIn var(--transition-normal);
}

.slide-up {
  animation: slideUp var(--transition-normal);
}
```

---

## 🧩 Componentes Principales

### 1. Configuración de Axios (src/api/axios.config.js)

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 2. Servicio de Autenticación (src/api/auth.service.js)

```javascript
import axios from './axios.config';

export const authService = {
  // Registro
  async register(userData) {
    const response = await axios.post('/auth/register', {
      user_name: userData.name,
      user_mail: userData.email,
      user_password: userData.password,
    });
    return response.data;
  },

  // Login
  async login(credentials) {
    const response = await axios.post('/auth/login', {
      user_mail: credentials.email,
      user_password: credentials.password,
    });
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
```

### 3. Servicio de Tareas (src/api/tasks.service.js)

```javascript
import axios from './axios.config';

export const tasksService = {
  // Obtener todas las tareas
  async getAllTasks() {
    const response = await axios.get('/tasks');
    return response.data;
  },

  // Obtener una tarea por ID
  async getTaskById(id) {
    const response = await axios.get(`/tasks/${id}`);
    return response.data;
  },

  // Crear nueva tarea
  async createTask(taskData) {
    const response = await axios.post('/tasks', {
      task_name: taskData.title,
      task_descrip: taskData.description,
      task_story_points: taskData.storyPoints || 0,
      task_delivery_date: taskData.dueDate,
      task_status: taskData.status || 'pending',
      categoryId: taskData.categoryId,
      assignedToId: taskData.assignedToId,
    });
    return response.data;
  },

  // Actualizar tarea
  async updateTask(id, taskData) {
    const response = await axios.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Actualizar estado de tarea
  async updateTaskStatus(id, status) {
    const response = await axios.patch(`/tasks/${id}/status`, {
      task_status: status,
    });
    return response.data;
  },

  // Eliminar tarea
  async deleteTask(id) {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
  },
};
```

### 4. Servicio de Categorías (src/api/categories.service.js)

```javascript
import axios from './axios.config';

export const categoriesService = {
  // Obtener todas las categorías
  async getAllCategories() {
    const response = await axios.get('/categories');
    return response.data;
  },

  // Crear nueva categoría
  async createCategory(categoryData) {
    const response = await axios.post('/categories', {
      category_name: categoryData.name,
      category_descrip: categoryData.description,
      category_color: categoryData.color,
    });
    return response.data;
  },

  // Actualizar categoría
  async updateCategory(id, categoryData) {
    const response = await axios.patch(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Eliminar categoría
  async deleteCategory(id) {
    const response = await axios.delete(`/categories/${id}`);
    return response.data;
  },
};
```

---

## 🔐 Context API - Gestión de Estado

### AuthContext (src/context/AuthContext.jsx)

```javascript
import { createContext, useState, useEffect } from 'react';
import { authService } from '../api/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📋 Componentes de UI

### Sidebar (src/components/layout/Sidebar.jsx)

```javascript
import { Link, useLocation } from 'react-router-dom';
import { Home, Tag, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/components/sidebar.module.css';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/tasks', icon: Home, label: 'My Tasks' },
    { path: '/categories', icon: Tag, label: 'Categories' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span>📋</span>
        </div>
        <h1>TaskFlow</h1>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <User size={20} />
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user?.user_name}</p>
            <p className={styles.userEmail}>{user?.user_mail}</p>
          </div>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
```

### TaskCard (src/components/tasks/TaskCard.jsx)

```javascript
import { Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import styles from '../../styles/components/taskCard.module.css';

export const TaskCard = ({ task, onClick }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      pending: styles.statusPending,
      in_progress: styles.statusInProgress,
      completed: styles.statusCompleted,
      cancelled: styles.statusCancelled,
    };
    return statusMap[status] || '';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      pending: 'To Do',
      in_progress: 'In Progress',
      completed: 'Done',
      cancelled: 'Cancelled',
    };
    return labelMap[status] || status;
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.task_name}</h3>
        <span className={`${styles.status} ${getStatusClass(task.task_status)}`}>
          {getStatusLabel(task.task_status)}
        </span>
      </div>

      <p className={styles.description}>{task.task_descrip}</p>

      <div className={styles.footer}>
        <div className={styles.meta}>
          {task.task_delivery_date && (
            <div className={styles.date}>
              <Calendar size={14} />
              <span>{format(new Date(task.task_delivery_date), 'MMM dd')}</span>
            </div>
          )}
          
          {task.category && (
            <div 
              className={styles.category}
              style={{ backgroundColor: `${task.category.category_color}20` }}
            >
              <span style={{ color: task.category.category_color }}>
                {task.category.category_name}
              </span>
            </div>
          )}
        </div>

        <div className={styles.stats}>
          {task.task_story_points > 0 && (
            <div className={styles.priority}>
              <AlertCircle size={14} />
              <span>{task.task_story_points}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### Modal (src/components/common/Modal.jsx)

```javascript
import { X } from 'lucide-react';
import { useEffect } from 'react';
import styles from '../../styles/components/modal.module.css';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
```

---

## 🗺️ Rutas y Navegación

### Router (src/router.jsx)

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { CategoriesPage } from './pages/CategoriesPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/tasks" />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

---

## 📝 Guía de Implementación Paso a Paso

### Fase 1: Setup Inicial (Día 1)

#### ✅ Checklist

- [ ] Crear proyecto con Vite
- [ ] Instalar dependencias
- [ ] Configurar estructura de carpetas
- [ ] Crear archivos de estilos base (variables.css, reset.css, global.css)
- [ ] Configurar Axios
- [ ] Crear servicios API (auth, tasks, categories)
- [ ] Probar conexión con backend

#### Código de Ejemplo

```bash
# 1. Crear proyecto
npm create vite@latest taskflow-frontend -- --template react
cd taskflow-frontend

# 2. Instalar dependencias
npm install react-router-dom axios date-fns lucide-react react-hook-form zod

# 3. Iniciar servidor de desarrollo
npm run dev
```

---

### Fase 2: Autenticación (Día 2)

#### ✅ Checklist

- [ ] Crear AuthContext
- [ ] Implementar LoginPage
- [ ] Implementar RegisterPage
- [ ] Crear componentes de formulario (Input, Button)
- [ ] Implementar lógica de login/register
- [ ] Configurar rutas protegidas
- [ ] Probar flujo de autenticación completo

#### Componentes a Crear

1. `src/context/AuthContext.jsx`
2. `src/pages/LoginPage.jsx`
3. `src/pages/RegisterPage.jsx`
4. `src/components/common/Input.jsx`
5. `src/components/common/Button.jsx`

---

### Fase 3: Layout Principal (Día 3)

#### ✅ Checklist

- [ ] Crear Sidebar component
- [ ] Crear MainLayout component
- [ ] Implementar navegación
- [ ] Estilizar sidebar según diseño
- [ ] Agregar user info en sidebar
- [ ] Implementar logout

#### Componentes a Crear

1. `src/components/layout/Sidebar.jsx`
2. `src/components/layout/MainLayout.jsx`
3. `src/styles/components/sidebar.module.css`

---

### Fase 4: Vista de Tareas (Día 4-5)

#### ✅ Checklist

- [ ] Crear TasksPage
- [ ] Crear TaskCard component
- [ ] Crear TaskList component
- [ ] Implementar grid de tareas
- [ ] Conectar con API para obtener tareas
- [ ] Implementar badges de estado
- [ ] Agregar iconos y metadata

#### Componentes a Crear

1. `src/pages/TasksPage.jsx`
2. `src/components/tasks/TaskCard.jsx`
3. `src/components/tasks/TaskList.jsx`
4. `src/styles/components/taskCard.module.css`

---

### Fase 5: Crear/Editar Tareas (Día 6-7)

#### ✅ Checklist

- [ ] Crear Modal component
- [ ] Crear CreateTaskModal
- [ ] Crear EditTaskModal
- [ ] Implementar formularios
- [ ] Crear Select component para categorías
- [ ] Crear DatePicker component
- [ ] Conectar con API (POST, PATCH)
- [ ] Validar formularios
- [ ] Actualizar lista tras crear/editar

#### Componentes a Crear

1. `src/components/common/Modal.jsx`
2. `src/components/tasks/CreateTaskModal.jsx`
3. `src/components/tasks/EditTaskModal.jsx`
4. `src/components/common/Select.jsx`
5. `src/components/common/DatePicker.jsx`
6. `src/components/common/Textarea.jsx`

---

### Fase 6: Gestión de Categorías (Día 8)

#### ✅ Checklist

- [ ] Crear CategoriesPage
- [ ] Crear CategoryCard component
- [ ] Crear CreateCategoryModal
- [ ] Implementar selector de colores
- [ ] Conectar con API
- [ ] Estilizar según diseño

#### Componentes a Crear

1. `src/pages/CategoriesPage.jsx`
2. `src/components/categories/CategoryCard.jsx`
3. `src/components/categories/CreateCategoryModal.jsx`
4. `src/components/common/ColorPicker.jsx`

---

### Fase 7: Refinamiento y Testing (Día 9-10)

#### ✅ Checklist

- [ ] Optimizar rendimiento
- [ ] Agregar loading states
- [ ] Implementar error handling
- [ ] Agregar animaciones
- [ ] Testing de funcionalidades
- [ ] Responsive design
- [ ] Corregir bugs
- [ ] Pulir UI/UX

---

## 🎯 Referencias de Diseño

### Imágenes de Referencia

Las imágenes de referencia muestran:

1. **Vista Principal de Tareas**
   - Sidebar oscuro a la izquierda
   - Grid de tarjetas de tareas
   - Botón "New Task" azul prominente
   - Cards con: título, descripción, fecha, categoría, estado

2. **Modal Crear Tarea**
   - Fondo oscuro semi-transparente
   - Card blanco centrado
   - Campos: Task Title, Description, Category, Due Date
   - Botones: Cancel (gris) y Create Task (azul)

3. **Modal Editar Tarea**
   - Similar a crear
   - Datos pre-poblados
   - Botón "Save Changes"

4. **Vista de Categorías**
   - Grid de cards de categorías
   - Selector de colores visual
   - 8 opciones de colores predefinidos

### Paleta de Colores Exacta

```css
/* Colores de Categorías */
--color-blue: #5B7FFF;
--color-purple: #9B6BFF;
--color-pink: #EC4899;
--color-red: #EF4444;
--color-orange: #F59E0B;
--color-green: #10B981;
--color-teal: #14B8A6;
--color-cyan: #06B6D4;
```

---

## 🚀 Comandos Útiles

### Desarrollo

```bash
# Iniciar frontend
npm run dev

# Iniciar backend (en otra terminal)
cd todo-nestjs
npm run start:dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

### Testing de API con cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_mail":"test@example.com","user_password":"password123"}'

# Obtener tareas (requiere token)
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📚 Recursos Adicionales

### Documentación

- [NestJS Docs](https://docs.nestjs.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/)

### Swagger API Docs

Una vez que el backend esté corriendo, acceder a:
```
http://localhost:3000/api
```

---

## ⚠️ Consideraciones Importantes

1. **CORS**: Asegurarse de que el backend tenga CORS habilitado para `http://localhost:5173` (puerto de Vite)

2. **JWT Storage**: Los tokens se guardan en `localStorage`. Para producción, considerar cookies httpOnly

3. **Error Handling**: Implementar manejo robusto de errores en todos los servicios

4. **Loading States**: Agregar spinners y skeletons para mejor UX

5. **Validación**: Validar datos tanto en frontend como backend

6. **Responsive**: Asegurar que funcione en mobile, tablet y desktop

---

## 🎉 Resultado Final

Al completar esta guía tendrás:

✅ Aplicación frontend completa conectada al backend NestJS  
✅ Sistema de autenticación JWT funcional  
✅ CRUD completo de tareas y categorías  
✅ UI moderna y profesional según diseño de referencia  
✅ Código organizado y mantenible  
✅ Componentes reutilizables

---

**¡Buena suerte con la implementación! 🚀**
