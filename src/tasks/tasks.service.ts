import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private usersService: UsersService,
        private categoriesService: CategoriesService,
    ) { }

    async create(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
        const creator = await this.usersService.findOne(+creatorId);

        if (!creator) {
            throw new NotFoundException('User (creator) not found');
        }

        const task = this.tasksRepository.create({
            task_name: createTaskDto.task_name,
            task_descrip: createTaskDto.task_descrip,
            task_story_points: createTaskDto.task_story_points,
            task_delivery_date: createTaskDto.task_delivery_date
                ? new Date(createTaskDto.task_delivery_date)
                : undefined,
            task_status: createTaskDto.task_status,
            creator,
        });

        // Asignar usuario si se especifica
        if (createTaskDto.assignedToId) {
            const assignedUser = await this.usersService.findOne(+createTaskDto.assignedToId);
            if (assignedUser) {
                task.assignedTo = assignedUser;
            }
        }

        // Asignar categoría si se especifica
        if (createTaskDto.categoryId) {
            const category = await this.categoriesService.findOne(createTaskDto.categoryId);
            if (category) {
                task.category = category;
            }
        }

        return await this.tasksRepository.save(task);
    }

    async findAll(): Promise<Task[]> {
        return await this.tasksRepository.find({
            relations: ['creator', 'assignedTo', 'category'],
        });
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { task_id: id },
            relations: ['creator', 'assignedTo', 'category'],
        });

        if (!task) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }

        return task;
    }

    async updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto): Promise<Task> {
        const task = await this.findOne(id);
        task.task_status = updateStatusDto.task_status;
        return await this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findOne(id);
        await this.tasksRepository.remove(task);
    }
}
