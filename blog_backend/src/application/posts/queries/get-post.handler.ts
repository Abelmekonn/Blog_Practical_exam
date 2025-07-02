import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler } from '../../../core/cqrs/query.base';
import { GetPostQuery } from './get-post.query';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';
import { Post } from '../../../domain/posts/post.entity';
import { PostNotFoundException } from '../../../core/exceptions';

@Injectable()
export class GetPostHandler implements IQueryHandler<GetPostQuery, Post> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(query: GetPostQuery): Promise<Post> {
    const { id } = query;

    const post = await this.postRepository.findWithComments(id);
    if (!post) {
      throw new PostNotFoundException(id);
    }

    return post;
  }
}
