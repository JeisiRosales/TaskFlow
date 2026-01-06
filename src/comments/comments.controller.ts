import { Controller, Get, Post, Body, Param, UseGuards, Delete, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('tasks/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post(':taskId')
    create(
        @Param('taskId') taskId: string,
        @Body() createCommentDto: CreateCommentDto,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.create(taskId, createCommentDto, user.userId);
    }

    @Get(':taskId')
    findByTask(@Param('taskId') taskId: string) {
        return this.commentsService.findByTask(taskId);
    }

    @Patch(':taskId')
    update(@Param('taskId') taskId: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.update(taskId, updateCommentDto);
    }

    @Delete(':taskId')
    remove(@Param('taskId') taskId: string) {
        return this.commentsService.delete(taskId);
    }
}
