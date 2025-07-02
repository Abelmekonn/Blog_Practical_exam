import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { DeletePostCommand } from './delete-post.command';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';

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
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if user is the author of the post
    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.delete(id);
  }
}
