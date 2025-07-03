import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler } from '../../../core/cqrs/query.base';
import { GetPostsQuery } from './get-posts.query';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';
import { Post } from '../../../domain/posts/post.entity';
import { PaginatedResponse } from '../../../core';

@Injectable()
export class GetPostsHandler
  implements IQueryHandler<GetPostsQuery, PaginatedResponse<Post>>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(query: GetPostsQuery): Promise<PaginatedResponse<Post>> {
    const { page, limit, authorId, search } = query;

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const total = await this.postRepository.count(authorId, search);

    // Get paginated posts
    let posts: Post[];
    if (authorId) {
      posts = await this.postRepository.findByAuthorIdPaginated(
        authorId,
        limit,
        offset,
        search,
      );
    } else {
      posts = await this.postRepository.findAllPaginated(limit, offset, search);
    }

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data: posts,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
