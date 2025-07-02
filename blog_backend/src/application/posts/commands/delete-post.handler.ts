import { Injectable, Inject } from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { DeletePostCommand } from './delete-post.command';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';
import {
  PostNotFoundException,
  UnauthorizedPostAccessException,
} from '../../../core/exceptions';

@Injectable()
export class DeletePostHandler
  implements ICommandHandler<DeletePostCommand, void>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { id, userId } = command;

    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new PostNotFoundException(id);
    }

    // Check if user is the author of the post
    if (post.author.id !== userId) {
      throw new UnauthorizedPostAccessException(id, userId);
    }

    await this.postRepository.delete(id);
  }
}
