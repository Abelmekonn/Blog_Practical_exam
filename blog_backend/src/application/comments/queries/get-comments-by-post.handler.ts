import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler } from '../../../core/cqrs/query.base';
import { GetCommentsByPostQuery } from './get-comments-by-post.query';
import { COMMENT_REPOSITORY } from '../../../domain/comments/comment.repository.interface';
import { ICommentRepository } from '../../../domain/comments/comment.repository.interface';
import { Comment } from '../../../domain/comments/comment.entity';

@Injectable()
export class GetCommentsByPostHandler implements IQueryHandler<GetCommentsByPostQuery, Comment[]> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(query: GetCommentsByPostQuery): Promise<Comment[]> {
    const { postId } = query;
    return this.commentRepository.findByPostId(postId);
  }
}