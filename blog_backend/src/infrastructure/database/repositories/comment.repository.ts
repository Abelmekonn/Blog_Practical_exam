import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.orm-entity';
import { ICommentRepository } from '../../../domain/comments/comment.repository.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class CommentRepository
  extends BaseRepository<Comment>
  implements ICommentRepository
{
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'post'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
        post: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }
}
