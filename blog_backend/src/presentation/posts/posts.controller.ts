import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
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
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// Command Handlers
import { CreatePostHandler } from '../../application/posts/commands/create-post.handler';
import { UpdatePostHandler } from '../../application/posts/commands/update-post.handler';
import { DeletePostHandler } from '../../application/posts/commands/delete-post.handler';

// Query Handlers
import { GetPostHandler } from '../../application/posts/queries/get-post.handler';
import { GetPostsHandler } from '../../application/posts/queries/get-posts.handler';

// Commands and Queries
import { CreatePostCommand } from '../../application/posts/commands/create-post.command';
import { UpdatePostCommand } from '../../application/posts/commands/update-post.command';
import { DeletePostCommand } from '../../application/posts/commands/delete-post.command';
import { GetPostQuery } from '../../application/posts/queries/get-post.query';
import { GetPostsQuery } from '../../application/posts/queries/get-posts.query';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostHandler: CreatePostHandler,
    private readonly updatePostHandler: UpdatePostHandler,
    private readonly deletePostHandler: DeletePostHandler,
    private readonly getPostHandler: GetPostHandler,
    private readonly getPostsHandler: GetPostsHandler,
  ) {}

  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Create a new blog post with title, content, and optional image',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    description: 'Post created successfully',
    schema: {
      example: {
        id: 'post-uuid-123',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const command = new CreatePostCommand(
      createPostDto.title,
      createPostDto.content,
      req.user.id,
      createPostDto.imageUrl,
      createPostDto.imagePublicId,
    );
    const postId = await this.createPostHandler.execute(command);
    return { id: postId };
  }

  @ApiOperation({
    summary: 'Get all posts',
    description:
      'Retrieve all blog posts with pagination support, optionally filtered by author',
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'Filter posts by author ID',
    example: 'author-uuid-123',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of posts per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in post title and content',
    example: 'web development',
  })
  @ApiOkResponse({
    description: 'Paginated list of posts retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 'post-uuid-123',
            title: 'My First Blog Post',
            content: 'This is the content of my first blog post...',
            imageUrl: 'https://example.com/image.jpg',
            author: {
              id: 'author-uuid-123',
              name: 'John Doe',
              email: 'john@example.com',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
      },
    },
  })
  @Get()
  async findAll(
    @Query('authorId') authorId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const query = new GetPostsQuery(
      page || 1,
      limit || 10,
      search,
      undefined, // tags - not implemented yet
      authorId,
    );
    return this.getPostsHandler.execute(query);
  }

  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Retrieve a specific blog post with all its comments',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: 'post-uuid-123',
  })
  @ApiOkResponse({
    description: 'Post retrieved successfully',
    schema: {
      example: {
        id: 'post-uuid-123',
        title: 'My First Blog Post',
        content: 'This is the content of my first blog post...',
        imageUrl: 'https://example.com/image.jpg',
        author: {
          id: 'author-uuid-123',
          name: 'John Doe',
          email: 'john@example.com',
        },
        comments: [
          {
            id: 'comment-uuid-123',
            content: 'Great post!',
            author: {
              id: 'commenter-uuid-123',
              name: 'Jane Smith',
            },
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = new GetPostQuery(id);
    return this.getPostHandler.execute(query);
  }

  @ApiOperation({
    summary: 'Update a post',
    description: 'Update an existing blog post (only by the author)',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID to update',
    example: 'post-uuid-123',
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({
    description: 'Post updated successfully',
    schema: {
      example: {
        message: 'Post updated successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'You can only update your own posts' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const command = new UpdatePostCommand(
      id,
      req.user.id,
      updatePostDto.title,
      updatePostDto.content,
      updatePostDto.imageUrl,
      updatePostDto.imagePublicId,
    );
    await this.updatePostHandler.execute(command);

    // Fetch and return the updated post
    const query = new GetPostQuery(id);
    return this.getPostHandler.execute(query);
  }

  @ApiOperation({
    summary: 'Delete a post',
    description: 'Delete an existing blog post (only by the author)',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID to delete',
    example: 'post-uuid-123',
  })
  @ApiOkResponse({
    description: 'Post deleted successfully',
    schema: {
      example: {
        message: 'Post deleted successfully',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'JWT token missing or invalid' })
  @ApiForbiddenResponse({ description: 'You can only delete your own posts' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const command = new DeletePostCommand(id, req.user.id);
    await this.deletePostHandler.execute(command);
    return { message: 'Post deleted successfully' };
  }
}
