import { IBaseRepository } from '../../core/base/base.repository.interface';
import { Comment } from './comment.entity';

export interface ICommentRepository extends IBaseRepository<Comment> {
  findByPostId(postId: string): Promise<Comment[]>;
  findByAuthorId(authorId: string): Promise<Comment[]>;
}

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');
