import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../types/request.types';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
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

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly createCommentHandler: CreateCommentHandler,
    private readonly deleteCommentHandler: DeleteCommentHandler,
    private readonly getCommentsByPostHandler: GetCommentsByPostHandler,
  ) {}

  @ApiOperation({
    summary: 'Create a new comment',
    description: 'Add a comment to a specific blog post',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: 'Comment created successfully',
    schema: {
      example: {
        id: 'comment-uuid-123',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const command = new CreateCommentCommand(
      createCommentDto.content,
      createCommentDto.postId,
      req.user.id,
    );
    const commentId = await this.createCommentHandler.execute(command);
    return { id: commentId };
  }

  @ApiOperation({
    summary: 'Get all comments for a post',
    description: 'Retrieve all comments associated with a specific blog post',
  })
  @ApiParam({
    name: 'postId',
    description: 'Post ID to get comments for',
    example: 'post-uuid-123',
  })
  @ApiOkResponse({
    description: 'Comments retrieved successfully',
    schema: {
      example: [
        {
          id: 'comment-uuid-123',
          content: 'This is a great post! Thanks for sharing.',
          author: {
            id: 'author-uuid-123',
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          post: {
            id: 'post-uuid-123',
            title: 'My First Blog Post',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    const query = new GetCommentsByPostQuery(postId);
    return this.getCommentsByPostHandler.execute(query);
  }

  @ApiOperation({
    summary: 'Delete a comment',
    description: 'Delete an existing comment (only by the author)',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID to delete',
    example: 'comment-uuid-123',
  })
  @ApiOkResponse({
    description: 'Comment deleted successfully',
    schema: {
      example: {
        message: 'Comment deleted successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({
    description: 'You can only delete your own comments',
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const command = new DeleteCommentCommand(id, req.user.id);
    await this.deleteCommentHandler.execute(command);
    return { message: 'Comment deleted successfully' };
  }
}
