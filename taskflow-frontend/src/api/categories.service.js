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