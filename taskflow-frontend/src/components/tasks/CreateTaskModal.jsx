import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select, Button } from '../common/FormComponents';
import { tasksService } from '../../api/tasks.service';
import { categoriesService } from '../../api/categories.service';

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        dueDate: '',
        storyPoints: 0
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const data = await categoriesService.getAllCategories();
                    setCategories(data);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newTask = await tasksService.createTask(formData);
            onTaskCreated(newTask);
            setFormData({ title: '', description: '', categoryId: '', dueDate: '', storyPoints: 0 });
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const categoryOptions = [
        { value: '', label: 'Select a category (optional)' },
        ...categories.map(c => ({ value: c.category_id, label: c.category_name }))
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
            <form onSubmit={handleSubmit}>
                <Input
                    label="Task Title"
                    name="title"
                    placeholder="Enter task title..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <Textarea
                    label="Description"
                    name="description"
                    placeholder="Describe the task..."
                    value={formData.description}
                    onChange={handleChange}
                />
                <Select
                    label="Category"
                    name="categoryId"
                    options={categoryOptions}
                    value={formData.categoryId}
                    onChange={handleChange}
                />
                <Input
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                />

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</Button>
                </div>
            </form>
        </Modal>
    );
};
