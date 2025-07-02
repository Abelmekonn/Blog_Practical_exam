import { IBaseRepository } from '../../core/base/base.repository.interface';
import { Post } from './post.entity';

export interface IPostRepository extends IBaseRepository<Post> {
  findByAuthorId(authorId: string): Promise<Post[]>;
  findWithComments(id: string): Promise<Post | null>;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');