import { Injectable, Inject } from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { CreateCommentCommand } from './create-comment.command';
import { COMMENT_REPOSITORY } from '../../../domain/comments/comment.repository.interface';
import { ICommentRepository } from '../../../domain/comments/comment.repository.interface';

@Injectable()
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand, string>
{
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { content, postId, authorId } = command;

    const comment = await this.commentRepository.create({
      content,
      post: { id: postId } as any,
      author: { id: authorId } as any,
    });

    return comment.id;
  }
}
