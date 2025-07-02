import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { DeletePostCommand } from './delete-post.command';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';

@Injectable()
export class DeletePostHandler implements ICommandHandler<DeletePostCommand, void> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { id } = command;
    
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postRepository.delete(id);
  }
}