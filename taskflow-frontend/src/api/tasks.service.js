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