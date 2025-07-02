import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { DeleteCommentCommand } from './delete-comment.command';
import { COMMENT_REPOSITORY } from '../../../domain/comments/comment.repository.interface';
import { ICommentRepository } from '../../../domain/comments/comment.repository.interface';

@Injectable()
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand, void> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id } = command;
    
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.commentRepository.delete(id);
  }
}