import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostHandler } from '../../src/application/posts/commands/create-post.handler';
import { UpdatePostHandler } from '../../src/application/posts/commands/update-post.handler';
import { DeletePostHandler } from '../../src/application/posts/commands/delete-post.handler';
import { GetPostHandler } from '../../src/application/posts/queries/get-post.handler';
import { GetPostsHandler } from '../../src/application/posts/queries/get-posts.handler';
import { CreatePostCommand } from '../../src/application/posts/commands/create-post.command';
import { UpdatePostCommand } from '../../src/application/posts/commands/update-post.command';
import { DeletePostCommand } from '../../src/application/posts/commands/delete-post.command';
import { GetPostQuery } from '../../src/application/posts/queries/get-post.query';
import { GetPostsQuery } from '../../src/application/posts/queries/get-posts.query';
import {
  IPostRepository,
  POST_REPOSITORY,
} from '../../src/domain/posts/post.repository.interface';
import { Post } from '../../src/domain/posts/post.entity';
import { User } from '../../src/domain/users/user.entity';
import {
  PostNotFoundException,
  UnauthorizedPostAccessException,
} from '../../src/core/exceptions';

describe('Posts Service Layer', () => {
  let createPostHandler: CreatePostHandler;
  let updatePostHandler: UpdatePostHandler;
  let deletePostHandler: DeletePostHandler;
  let getPostHandler: GetPostHandler;
  let getPostsHandler: GetPostsHandler;
  let postRepository: jest.Mocked<IPostRepository>;

  const mockUser: User = {
    id: 'user123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPost: Post = {
    id: 'post123',
    title: 'Test Post',
    content: 'This is a test post content',
    author: mockUser,
    imageUrl: 'https://example.com/image.jpg',
    imagePublicId: 'image-public-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPostRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByAuthorId: jest.fn(),
      findWithComments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostHandler,
        UpdatePostHandler,
        DeletePostHandler,
        GetPostHandler,
        GetPostsHandler,
        {
          provide: POST_REPOSITORY,
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    createPostHandler = module.get<CreatePostHandler>(CreatePostHandler);
    updatePostHandler = module.get<UpdatePostHandler>(UpdatePostHandler);
    deletePostHandler = module.get<DeletePostHandler>(DeletePostHandler);
    getPostHandler = module.get<GetPostHandler>(GetPostHandler);
    getPostsHandler = module.get<GetPostsHandler>(GetPostsHandler);
    postRepository = module.get(POST_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreatePostHandler', () => {
    it('should create a post successfully', async () => {
      const command = new CreatePostCommand(
        'New Post Title',
        'New post content',
        'user123',
        'https://example.com/new-image.jpg',
        'new-image-public-id',
      );

      postRepository.create.mockResolvedValue(mockPost);

      const result = await createPostHandler.execute(command);

      expect(result).toBe('post123');
      expect(postRepository.create).toHaveBeenCalledWith({
        title: 'New Post Title',
        content: 'New post content',
        author: { id: 'user123' },
        imageUrl: 'https://example.com/new-image.jpg',
        imagePublicId: 'new-image-public-id',
      });
    });

    it('should create a post without image', async () => {
      const command = new CreatePostCommand(
        'Post Without Image',
        'Content without image',
        'user123',
      );

      postRepository.create.mockResolvedValue({
        ...mockPost,
        imageUrl: undefined,
        imagePublicId: undefined,
      });

      const result = await createPostHandler.execute(command);

      expect(result).toBe('post123');
      expect(postRepository.create).toHaveBeenCalledWith({
        title: 'Post Without Image',
        content: 'Content without image',
        author: { id: 'user123' },
        imageUrl: undefined,
        imagePublicId: undefined,
      });
    });
  });

  describe('UpdatePostHandler', () => {
    it('should update a post successfully', async () => {
      const command = new UpdatePostCommand(
        'post123',
        'user123',
        'Updated Title',
        'Updated content',
        'https://example.com/updated-image.jpg',
        'updated-image-public-id',
      );

      postRepository.findById.mockResolvedValue(mockPost);
      postRepository.update.mockResolvedValue({
        ...mockPost,
        title: 'Updated Title',
        content: 'Updated content',
      });

      await updatePostHandler.execute(command);

      expect(postRepository.findById).toHaveBeenCalledWith('post123');
      expect(postRepository.update).toHaveBeenCalledWith('post123', {
        title: 'Updated Title',
        content: 'Updated content',
        imageUrl: 'https://example.com/updated-image.jpg',
        imagePublicId: 'updated-image-public-id',
      });
    });

    it('should throw PostNotFoundException when post does not exist', async () => {
      const command = new UpdatePostCommand(
        'nonexistent',
        'user123',
        'Title',
        'Content',
      );

      postRepository.findById.mockResolvedValue(null);

      await expect(updatePostHandler.execute(command)).rejects.toThrow(
        PostNotFoundException,
      );

      expect(postRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedPostAccessException when user is not the author', async () => {
      const command = new UpdatePostCommand(
        'post123',
        'otheruser',
        'Title',
        'Content',
      );

      postRepository.findById.mockResolvedValue(mockPost);

      await expect(updatePostHandler.execute(command)).rejects.toThrow(
        UnauthorizedPostAccessException,
      );

      expect(postRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('DeletePostHandler', () => {
    it('should delete a post successfully', async () => {
      const command = new DeletePostCommand('post123', 'user123');

      postRepository.findById.mockResolvedValue(mockPost);
      postRepository.delete.mockResolvedValue(undefined);

      await deletePostHandler.execute(command);

      expect(postRepository.findById).toHaveBeenCalledWith('post123');
      expect(postRepository.delete).toHaveBeenCalledWith('post123');
    });

    it('should throw PostNotFoundException when post does not exist', async () => {
      const command = new DeletePostCommand('nonexistent', 'user123');

      postRepository.findById.mockResolvedValue(null);

      await expect(deletePostHandler.execute(command)).rejects.toThrow(
        PostNotFoundException,
      );

      expect(postRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedPostAccessException when user is not the author', async () => {
      const command = new DeletePostCommand('post123', 'otheruser');

      postRepository.findById.mockResolvedValue(mockPost);

      await expect(deletePostHandler.execute(command)).rejects.toThrow(
        UnauthorizedPostAccessException,
      );

      expect(postRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('GetPostHandler', () => {
    it('should get a post by id successfully', async () => {
      const query = new GetPostQuery('post123');

      postRepository.findWithComments.mockResolvedValue(mockPost);

      const result = await getPostHandler.execute(query);

      expect(result).toEqual(mockPost);
      expect(postRepository.findWithComments).toHaveBeenCalledWith('post123');
    });

    it('should throw PostNotFoundException when post does not exist', async () => {
      const query = new GetPostQuery('nonexistent');

      postRepository.findWithComments.mockResolvedValue(null);

      await expect(getPostHandler.execute(query)).rejects.toThrow(
        PostNotFoundException,
      );
    });
  });

  describe('GetPostsHandler', () => {
    it('should get all posts when no author filter is provided', async () => {
      const query = new GetPostsQuery();
      const mockPosts = [mockPost, { ...mockPost, id: 'post456' }];

      postRepository.findAll.mockResolvedValue(mockPosts);

      const result = await getPostsHandler.execute(query);

      expect(result).toEqual(mockPosts);
      expect(postRepository.findAll).toHaveBeenCalled();
      expect(postRepository.findByAuthorId).not.toHaveBeenCalled();
    });

    it('should get posts by author when author filter is provided', async () => {
      const query = new GetPostsQuery('user123');
      const mockAuthorPosts = [mockPost];

      postRepository.findByAuthorId.mockResolvedValue(mockAuthorPosts);

      const result = await getPostsHandler.execute(query);

      expect(result).toEqual(mockAuthorPosts);
      expect(postRepository.findByAuthorId).toHaveBeenCalledWith('user123');
      expect(postRepository.findAll).not.toHaveBeenCalled();
    });

    it('should return empty array when no posts found', async () => {
      const query = new GetPostsQuery();

      postRepository.findAll.mockResolvedValue([]);

      const result = await getPostsHandler.execute(query);

      expect(result).toEqual([]);
      expect(postRepository.findAll).toHaveBeenCalled();
    });
  });
});
