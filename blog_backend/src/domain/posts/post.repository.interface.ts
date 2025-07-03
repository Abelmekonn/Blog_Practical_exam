import { IBaseRepository } from '../../core/base/base.repository.interface';
import { Post } from './post.entity';

export interface IPostRepository extends IBaseRepository<Post> {
  findByAuthorId(authorId: string): Promise<Post[]>;
  findWithComments(id: string): Promise<Post | null>;
  findAllPaginated(
    limit: number,
    offset: number,
    search?: string,
  ): Promise<Post[]>;
  findByAuthorIdPaginated(
    authorId: string,
    limit: number,
    offset: number,
    search?: string,
  ): Promise<Post[]>;
  count(authorId?: string, search?: string): Promise<number>;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');
