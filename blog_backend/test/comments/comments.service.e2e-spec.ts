import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommentHandler } from '../../src/application/comments/commands/create-comment.handler';
import { DeleteCommentHandler } from '../../src/application/comments/commands/delete-comment.handler';
import { GetCommentsByPostHandler } from '../../src/application/comments/queries/get-comments-by-post.handler';
import { CreateCommentCommand } from '../../src/application/comments/commands/create-comment.command';
import { DeleteCommentCommand } from '../../src/application/comments/commands/delete-comment.command';
import { GetCommentsByPostQuery } from '../../src/application/comments/queries/get-comments-by-post.query';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../src/domain/comments/comment.repository.interface';
import { Comment } from '../../src/domain/comments/comment.entity';
import { User } from '../../src/domain/users/user.entity';
import { Post } from '../../src/domain/posts/post.entity';
import {
  CommentNotFoundException,
  UnauthorizedCommentAccessException,
} from '../../src/core/exceptions';

describe('Comments Service Layer', () => {
  let createCommentHandler: CreateCommentHandler;
  let deleteCommentHandler: DeleteCommentHandler;
  let getCommentsByPostHandler: GetCommentsByPostHandler;
  let commentRepository: jest.Mocked<ICommentRepository>;

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
    content: 'Test post content',
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockComment: Comment = {
    id: 'comment123',
    content: 'This is a test comment',
    author: mockUser,
    post: mockPost,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockCommentRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByPostId: jest.fn(),
      findByAuthorId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentHandler,
        DeleteCommentHandler,
        GetCommentsByPostHandler,
        {
          provide: COMMENT_REPOSITORY,
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    createCommentHandler =
      module.get<CreateCommentHandler>(CreateCommentHandler);
    deleteCommentHandler =
      module.get<DeleteCommentHandler>(DeleteCommentHandler);
    getCommentsByPostHandler = module.get<GetCommentsByPostHandler>(
      GetCommentsByPostHandler,
    );
    commentRepository = module.get(COMMENT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateCommentHandler', () => {
    it('should create a comment successfully', async () => {
      const command = new CreateCommentCommand(
        'This is a new comment',
        'post123',
        'user123',
      );

      commentRepository.create.mockResolvedValue(mockComment);

      const result = await createCommentHandler.execute(command);

      expect(result).toBe('comment123');
      expect(commentRepository.create).toHaveBeenCalledWith({
        content: 'This is a new comment',
        post: { id: 'post123' },
        author: { id: 'user123' },
      });
    });

    it('should handle long comment content', async () => {
      const longContent = 'A'.repeat(1000);
      const command = new CreateCommentCommand(
        longContent,
        'post123',
        'user123',
      );

      commentRepository.create.mockResolvedValue({
        ...mockComment,
        content: longContent,
      });

      const result = await createCommentHandler.execute(command);

      expect(result).toBe('comment123');
      expect(commentRepository.create).toHaveBeenCalledWith({
        content: longContent,
        post: { id: 'post123' },
        author: { id: 'user123' },
      });
    });

    it('should handle empty content gracefully', async () => {
      const command = new CreateCommentCommand('', 'post123', 'user123');

      commentRepository.create.mockResolvedValue({
        ...mockComment,
        content: '',
      });

      const result = await createCommentHandler.execute(command);

      expect(result).toBe('comment123');
      expect(commentRepository.create).toHaveBeenCalledWith({
        content: '',
        post: { id: 'post123' },
        author: { id: 'user123' },
      });
    });
  });

  describe('DeleteCommentHandler', () => {
    it('should delete a comment successfully', async () => {
      const command = new DeleteCommentCommand('comment123', 'user123');

      commentRepository.findById.mockResolvedValue(mockComment);
      commentRepository.delete.mockResolvedValue(undefined);

      await deleteCommentHandler.execute(command);

      expect(commentRepository.findById).toHaveBeenCalledWith('comment123');
      expect(commentRepository.delete).toHaveBeenCalledWith('comment123');
    });

    it('should throw CommentNotFoundException when comment does not exist', async () => {
      const command = new DeleteCommentCommand('nonexistent', 'user123');

      commentRepository.findById.mockResolvedValue(null);

      await expect(deleteCommentHandler.execute(command)).rejects.toThrow(
        CommentNotFoundException,
      );

      expect(commentRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedCommentAccessException when user is not the author', async () => {
      const command = new DeleteCommentCommand('comment123', 'otheruser');

      commentRepository.findById.mockResolvedValue(mockComment);

      await expect(deleteCommentHandler.execute(command)).rejects.toThrow(
        UnauthorizedCommentAccessException,
      );

      expect(commentRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle deletion of comment with different user ID format', async () => {
      const command = new DeleteCommentCommand('comment123', 'user123');
      const commentWithDifferentUserFormat = {
        ...mockComment,
        author: { ...mockUser, id: 'user123' },
      };

      commentRepository.findById.mockResolvedValue(
        commentWithDifferentUserFormat,
      );
      commentRepository.delete.mockResolvedValue(undefined);

      await deleteCommentHandler.execute(command);

      expect(commentRepository.delete).toHaveBeenCalledWith('comment123');
    });
  });

  describe('GetCommentsByPostHandler', () => {
    it('should get comments by post id successfully', async () => {
      const query = new GetCommentsByPostQuery('post123');
      const mockComments = [
        mockComment,
        { ...mockComment, id: 'comment456', content: 'Another comment' },
      ];

      commentRepository.findByPostId.mockResolvedValue(mockComments);

      const result = await getCommentsByPostHandler.execute(query);

      expect(result).toEqual(mockComments);
      expect(commentRepository.findByPostId).toHaveBeenCalledWith('post123');
    });

    it('should return empty array when no comments found', async () => {
      const query = new GetCommentsByPostQuery('post123');

      commentRepository.findByPostId.mockResolvedValue([]);

      const result = await getCommentsByPostHandler.execute(query);

      expect(result).toEqual([]);
      expect(commentRepository.findByPostId).toHaveBeenCalledWith('post123');
    });

    it('should handle post with many comments', async () => {
      const query = new GetCommentsByPostQuery('post123');
      const manyComments = Array.from({ length: 50 }, (_, i) => ({
        ...mockComment,
        id: `comment${i}`,
        content: `Comment number ${i}`,
      }));

      commentRepository.findByPostId.mockResolvedValue(manyComments);

      const result = await getCommentsByPostHandler.execute(query);

      expect(result).toHaveLength(50);
      expect(result[0].content).toBe('Comment number 0');
      expect(result[49].content).toBe('Comment number 49');
    });

    it('should handle invalid post id gracefully', async () => {
      const query = new GetCommentsByPostQuery('invalid-post-id');

      commentRepository.findByPostId.mockResolvedValue([]);

      const result = await getCommentsByPostHandler.execute(query);

      expect(result).toEqual([]);
      expect(commentRepository.findByPostId).toHaveBeenCalledWith(
        'invalid-post-id',
      );
    });
  });
});
