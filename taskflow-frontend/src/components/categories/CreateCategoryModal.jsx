import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input, Button, Textarea } from '../common/FormComponents';
import { categoriesService } from '../../api/categories.service';

const COLORS = [
    '#5B7FFF', '#9B6BFF', '#EC4899', '#EF4444',
    '#F59E0B', '#10B981', '#14B8A6', '#06B6D4'
];

export const CreateCategoryModal = ({ isOpen, onClose, onCategoryCreated, onCategoryUpdated, categoryToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!categoryToEdit;

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setName(categoryToEdit.category_name);
                setDescription(categoryToEdit.category_descrip || '');
                setColor(categoryToEdit.category_color);
            } else {
                setName('');
                setDescription('');
                setColor(COLORS[0]);
            }
        }
    }, [isOpen, categoryToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        try {
            if (isEditMode) {
                const updated = await categoriesService.updateCategory(categoryToEdit.category_id, {
                    category_name: name,
                    category_descrip: description,
                    category_color: color
                });
                onCategoryUpdated(updated);
            } else {
                const newCategory = await categoriesService.createCategory({
                    name,
                    description,
                    color
                });
                onCategoryCreated(newCategory);
                setName('');
                setDescription('');
            }
            onClose();
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Category' : 'Create Category'}>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Category Name"
                    placeholder="e.g., Work, Personal, Urgent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Textarea
                    label="Description"
                    placeholder="Brief description of the category"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '500' }}>Color</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {COLORS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                style={{
                                    height: '40px',
                                    backgroundColor: c,
                                    borderRadius: 'var(--radius-md)',
                                    border: color === c ? '3px solid white' : 'none',
                                    cursor: 'pointer',
                                    boxShadow: color === c ? '0 0 0 2px ' + c : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Category')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
