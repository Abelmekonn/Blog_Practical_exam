import { IQuery } from '../../../core/cqrs/query.base';
import { PaginatedResponse } from '../../../core';
import { Post } from '../../../domain/posts/post.entity';

export class GetPostsQuery implements IQuery<PaginatedResponse<Post>> {
  readonly _type = 'GetPosts';

  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly search?: string,
    public readonly tags?: string[],
    public readonly authorId?: string,
  ) {}
}
