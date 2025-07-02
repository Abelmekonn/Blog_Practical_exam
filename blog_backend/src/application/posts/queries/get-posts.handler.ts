import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler } from '../../../core/cqrs/query.base';
import { GetPostsQuery } from './get-posts.query';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';
import { Post } from '../../../domain/posts/post.entity';

@Injectable()
export class GetPostsHandler implements IQueryHandler<GetPostsQuery, Post[]> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(query: GetPostsQuery): Promise<Post[]> {
    const { authorId } = query;
    
    if (authorId) {
      return this.postRepository.findByAuthorId(authorId);
    }
    
    return this.postRepository.findAll();
  }
}