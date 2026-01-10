import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
        private tasksService: TasksService,
        private usersService: UsersService,
    ) { }

    async create(taskId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
        const task = await this.tasksService.findOne(taskId);
        const user = await this.usersService.findById(userId);

        const comment = this.commentsRepository.create({
            comment_content: createCommentDto.comment_content,
            task: task as any,
            creator: user as any,
        });

        return await this.commentsRepository.save(comment);
    }

    async findByTask(taskId: string): Promise<Comment[]> {
        return await this.commentsRepository.find({
            where: { task: { task_id: taskId } },
            relations: ['creator'],
            order: { comment_date: 'ASC' },
        });
    }

    async delete(id: string): Promise<void> {
        await this.commentsRepository.delete(id);
    }

    async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
        const comment = await this.commentsRepository.findOne({
            where: { comment_id: id }
        });

        if (!comment) {
            throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
        }
        comment.comment_content = updateCommentDto.comment_content;
        return await this.commentsRepository.save(comment);
    }
}
