import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt, Min, IsDateString, IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    task_name: string;

    @IsString()
    @IsOptional()
    task_descrip?: string;

    @IsInt()
    @IsOptional()
    assignedToId?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    task_story_points?: number;

    @IsDateString()
    @IsOptional()
    task_delivery_date?: string;

    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    task_status?: TaskStatus;
}
