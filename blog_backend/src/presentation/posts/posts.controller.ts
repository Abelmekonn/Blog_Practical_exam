import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
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

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostHandler: CreatePostHandler,
    private readonly updatePostHandler: UpdatePostHandler,
    private readonly deletePostHandler: DeletePostHandler,
    private readonly getPostHandler: GetPostHandler,
    private readonly getPostsHandler: GetPostsHandler,
  ) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Returns all posts' })
  @Get()
  async findAll(@Query('authorId') authorId?: string) {
    const query = new GetPostsQuery(authorId);
    return this.getPostsHandler.execute(query);
  }

  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Returns the post' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const query = new GetPostQuery(id);
    return this.getPostHandler.execute(query);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
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
    return { message: 'Post updated successfully' };
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const command = new DeletePostCommand(id, req.user.id);
    await this.deletePostHandler.execute(command);
    return { message: 'Post deleted successfully' };
  }
}
