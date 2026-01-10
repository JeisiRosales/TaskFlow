import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button, Input, Textarea, Select } from '../common/FormComponents';
import { tasksService } from '../../api/tasks.service';
import { commentsService } from '../../api/comments.service';
import { Trash2, Edit2, Send, Clock, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

export const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdated, onTaskDeleted }) => {
    const { user: currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...task });
    const [loading, setLoading] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');

    useEffect(() => {
        if (isOpen && task) {
            fetchComments();
            setEditData({ ...task });
            setIsEditing(false);
        }
    }, [isOpen, task]);

    const fetchComments = async () => {
        try {
            const data = await commentsService.getCommentsByTask(task.task_id);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const updatedTask = await tasksService.updateTaskStatus(task.task_id, newStatus);
            onTaskUpdated(updatedTask);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedTask = await tasksService.updateTask(task.task_id, {
                task_name: editData.task_name,
                task_descrip: editData.task_descrip,
                task_story_points: editData.task_story_points,
                task_delivery_date: editData.task_delivery_date,
            });
            onTaskUpdated(updatedTask);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksService.deleteTask(task.task_id);
                onTaskDeleted(task.task_id);
                onClose();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const created = await commentsService.createComment(task.task_id, newComment);
            setComments([...comments, created]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentsService.deleteComment(commentId);
            setComments(comments.filter(c => c.comment_id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleStartEditComment = (comment) => {
        setEditingCommentId(comment.comment_id);
        setEditCommentContent(comment.comment_content);
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (!editCommentContent.trim()) return;
        try {
            const updated = await commentsService.updateComment(editingCommentId, editCommentContent);
            setComments(comments.map(c => c.comment_id === editingCommentId ? updated : c));
            setEditingCommentId(null);
            setEditCommentContent('');
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Task' : 'Task Details'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Task Details / Edit Form */}
                <section>
                    {isEditing ? (
                        <form onSubmit={handleUpdateTask}>
                            <Input
                                label="Title"
                                value={editData.task_name}
                                onChange={e => setEditData({ ...editData, task_name: e.target.value })}
                                required
                            />
                            <Textarea
                                label="Description"
                                value={editData.task_descrip}
                                onChange={e => setEditData({ ...editData, task_descrip: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>Save Changes</Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>{task.task_name}</h3>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            backgroundColor: 'rgba(91, 127, 255, 0.1)',
                                            color: 'var(--color-primary)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {task.task_status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        {task.category && (
                                            <span style={{
                                                backgroundColor: `${task.category.category_color}20`,
                                                color: task.category.category_color,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {task.category.category_name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={handleDeleteTask} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                                {task.task_descrip || 'No description provided.'}
                            </p>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Change Status</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['pending', 'in_progress', 'completed', 'cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                border: '1px solid var(--color-border)',
                                                backgroundColor: task.task_status === status ? 'var(--color-primary)' : 'transparent',
                                                color: task.task_status === status ? 'white' : 'var(--color-text-secondary)',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                transition: '0.2s'
                                            }}
                                        >
                                            {status.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0' }} />

                {/* Comments Section */}
                <section>
                    <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Comments <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>({comments.length})</span>
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px', paddingRight: '10px' }}>
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment.comment_id} style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <UserIcon size={16} color="var(--color-text-secondary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{comment.creator?.user_name || 'User'}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                                            {format(new Date(comment.comment_date), 'MMM dd, HH:mm')}
                                        </span>
                                    </div>
                                    {editingCommentId === comment.comment_id ? (
                                        <form onSubmit={handleUpdateComment} style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                value={editCommentContent}
                                                onChange={e => setEditCommentContent(e.target.value)}
                                                autoFocus
                                                style={{
                                                    flex: 1,
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid var(--color-primary)',
                                                    fontSize: '14px',
                                                    backgroundColor: 'var(--color-background)',
                                                    color: 'var(--color-text-primary)'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Save</button>
                                                <button type="button" onClick={() => setEditingCommentId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                                            {comment.comment_content}
                                        </p>
                                    )}
                                </div>
                                {comment.creator?.user_id === currentUser?.user_id && editingCommentId !== comment.comment_id && (
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => handleStartEditComment(comment)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', opacity: 0.5 }}
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.comment_id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', opacity: 0.5 }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px' }}>No comments yet.</p>
                        )}
                    </div>

                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '10px 16px',
                                borderRadius: '24px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background)',
                                color: 'var(--color-text-primary)',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: !newComment.trim() ? 0.5 : 1
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </section>

            </div>
        </Modal>
    );
};
