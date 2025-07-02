import { Test, TestingModule } from "@nestjs/testing";
import { CreatePostHandler } from "./create-post.handler";
import { CreatePostCommand } from "./create-post.command";
import {
  IPostRepository,
  POST_REPOSITORY,
} from "../../../domain/posts/post.repository.interface";
import { Post } from "../../../domain/posts/post.entity";

describe("CreatePostHandler", () => {
  let handler: CreatePostHandler;
  let postRepository: jest.Mocked<IPostRepository>;

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
        {
          provide: POST_REPOSITORY,
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    handler = module.get<CreatePostHandler>(CreatePostHandler);
    postRepository = module.get(POST_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should create a post successfully", async () => {
      const command = new CreatePostCommand(
        "Test Title",
        "Test Content",
        "user123",
        "image-url",
        "image-public-id"
      );

      const mockPost: Post = {
        id: "post123",
        title: "Test Title",
        content: "Test Content",
        author: { id: "user123" } as any,
        imageUrl: "image-url",
        imagePublicId: "image-public-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      postRepository.create.mockResolvedValue(mockPost);

      const result = await handler.execute(command);

      expect(result).toBe("post123");
      expect(postRepository.create).toHaveBeenCalledWith({
        title: "Test Title",
        content: "Test Content",
        author: { id: "user123" },
        imageUrl: "image-url",
        imagePublicId: "image-public-id",
      });
    });

    it("should create a post without image", async () => {
      const command = new CreatePostCommand(
        "Test Title",
        "Test Content",
        "user123"
      );

      const mockPost: Post = {
        id: "post123",
        title: "Test Title",
        content: "Test Content",
        author: { id: "user123" } as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      postRepository.create.mockResolvedValue(mockPost);

      const result = await handler.execute(command);

      expect(result).toBe("post123");
      expect(postRepository.create).toHaveBeenCalledWith({
        title: "Test Title",
        content: "Test Content",
        author: { id: "user123" },
        imageUrl: undefined,
        imagePublicId: undefined,
      });
    });
  });
});
