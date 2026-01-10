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