import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    task_id: string;

    @Column({ length: 200 })
    task_name: string;

    @Column({ type: 'text', nullable: true })
    task_descrip: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'task_creator' })
    creator: User;

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'task_assign_to' })
    assignedTo: User;

    @Column({ type: 'int', default: 0 })
    task_story_points: number;

    @Column({ type: 'timestamp', nullable: true })
    task_delivery_date: Date;

    @ManyToOne(() => Category, { eager: true, nullable: true })
    @JoinColumn({ name: 'task_category' })
    category: Category;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    task_status: TaskStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
