import { useState, useEffect } from 'react';
import { tasksService } from '../api/tasks.service';
import { TaskCard } from '../components/tasks/TaskCard';
import { CreateTaskModal } from '../components/tasks/CreateTaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';

export const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const data = await tasksService.getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskCreated = (newTask) => {
        // Al crearla desde el modal a veces no viene con todas las relaciones, 
        // recargamos para asegurar consistencia o simplemente agregamos
        setTasks([newTask, ...tasks]);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(t => t.task_id === updatedTask.task_id ? updatedTask : t));
        setSelectedTask(updatedTask);
    };

    const handleTaskDeleted = (taskId) => {
        setTasks(tasks.filter(t => t.task_id !== taskId));
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px'
            }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '8px' }}>My Tasks</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Manage your tasks and stay organized</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                    + New Task
                </button>
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px'
                }}>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <TaskCard
                                key={task.task_id}
                                task={task}
                                onClick={() => setSelectedTask(task)}
                            />
                        ))
                    ) : (
                        <div style={{
                            gridColumn: '1 / -1',
                            backgroundColor: 'var(--color-surface)',
                            padding: '40px',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                            border: '1px solid var(--color-border)'
                        }}>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>No tasks found.</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                style={{
                                    color: 'var(--color-primary)',
                                    fontWeight: '600',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Create your first task
                            </button>
                        </div>
                    )}
                </div>
            )}

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />

            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
            />
        </div>
    );
};
