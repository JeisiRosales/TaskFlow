import { useState, useEffect } from 'react';
import { categoriesService } from '../api/categories.service';
import { CreateCategoryModal } from '../components/categories/CreateCategoryModal';
import { Trash2, Edit2 } from 'lucide-react';

export const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const data = await categoriesService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryCreated = (newCategory) => {
        setCategories([...categories, newCategory]);
    };

    const handleCategoryUpdated = (updatedCategory) => {
        setCategories(categories.map(c => c.category_id === updatedCategory.category_id ? updatedCategory : c));
    };

    const handleEditClick = (category) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? All related tasks might lose their category.')) {
            try {
                await categoriesService.deleteCategory(id);
                setCategories(categories.filter(c => c.category_id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Could not delete category. It might be in use.');
            }
        }
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
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: '8px' }}>Categories</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Organize your tasks with categories</p>
                </div>
                <button
                    onClick={handleCreateClick}
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
                    + New Category
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {loading ? (
                    <p>Loading categories...</p>
                ) : categories.length > 0 ? (
                    categories.map(category => (
                        <div key={category.category_id} style={{
                            backgroundColor: 'var(--color-surface)',
                            padding: '24px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            position: 'relative'
                        }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleEditClick(category)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px' }}>
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.category_id)}
                                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: category.category_color
                                }} />
                                <h3 style={{ margin: 0 }}>{category.category_name}</h3>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                {category.category_descrip || 'No description provided.'}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No categories found. Create your first one!</p>
                )}
            </div>

            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCategoryCreated={handleCategoryCreated}
                onCategoryUpdated={handleCategoryUpdated}
                categoryToEdit={categoryToEdit}
            />
        </div>
    );
};
