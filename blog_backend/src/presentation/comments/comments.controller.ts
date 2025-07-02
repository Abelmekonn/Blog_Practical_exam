import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

// Command Handlers
import { CreateCommentHandler } from '../../application/comments/commands/create-comment.handler';
import { DeleteCommentHandler } from '../../application/comments/commands/delete-comment.handler';

// Query Handlers
import { GetCommentsByPostHandler } from '../../application/comments/queries/get-comments-by-post.handler';

// Commands and Queries
import { CreateCommentCommand } from '../../application/comments/commands/create-comment.command';
import { DeleteCommentCommand } from '../../application/comments/commands/delete-comment.command';
import { GetCommentsByPostQuery } from '../../application/comments/queries/get-comments-by-post.query';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly createCommentHandler: CreateCommentHandler,
    private readonly deleteCommentHandler: DeleteCommentHandler,
    private readonly getCommentsByPostHandler: GetCommentsByPostHandler,
  ) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const command = new CreateCommentCommand(
      createCommentDto.content,
      createCommentDto.postId,
      req.user.id,
    );
    const commentId = await this.createCommentHandler.execute(command);
    return { id: commentId };
  }

  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'Returns all comments for the post' })
  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    const query = new GetCommentsByPostQuery(postId);
    return this.getCommentsByPostHandler.execute(query);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const command = new DeleteCommentCommand(id);
    await this.deleteCommentHandler.execute(command);
    return { message: 'Comment deleted successfully' };
  }
}