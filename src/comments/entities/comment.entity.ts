import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    comment_id: string;

    @Column({ type: 'text' })
    comment_content: string;

    @ManyToOne(() => Task, { eager: false })
    @JoinColumn({ name: 'comment_from_task' })
    task: Task;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'comment_creator' })
    creator: User;

    @CreateDateColumn()
    comment_date: Date;
}
