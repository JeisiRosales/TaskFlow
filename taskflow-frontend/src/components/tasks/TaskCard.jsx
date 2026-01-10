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
                            <span>{new Date(task.task_delivery_date).toString() !== 'Invalid Date'
                                ? format(new Date(task.task_delivery_date), 'MMM dd')
                                : 'No date'}</span>
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