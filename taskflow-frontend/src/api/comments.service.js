import axios from './axios.config';

export const commentsService = {
    // Obtener comentarios de una tarea
    async getCommentsByTask(taskId) {
        const response = await axios.get(`/tasks/comments/${taskId}`);
        return response.data;
    },

    // Crear un comentario
    async createComment(taskId, content) {
        const response = await axios.post(`/tasks/comments/${taskId}`, {
            comment_content: content
        });
        return response.data;
    },

    // Actualizar un comentario
    // Nota: El backend usa el parámetro ':taskId' pero espera el ID del comentario
    async updateComment(commentId, content) {
        const response = await axios.patch(`/tasks/comments/${commentId}`, {
            comment_content: content
        });
        return response.data;
    },

    // Eliminar un comentario
    // Nota: El backend usa el parámetro ':taskId' pero espera el ID del comentario
    async deleteComment(commentId) {
        const response = await axios.delete(`/tasks/comments/${commentId}`);
        return response.data;
    }
};
