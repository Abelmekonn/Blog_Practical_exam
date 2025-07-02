import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { UpdatePostCommand } from './update-post.command';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';

@Injectable()
export class UpdatePostHandler
  implements ICommandHandler<UpdatePostCommand, void>
{
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<void> {
    const { id, userId, title, content, imageUrl, imagePublicId } = command;

    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if user is the author of the post
    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imagePublicId !== undefined) updateData.imagePublicId = imagePublicId;

    await this.postRepository.update(id, updateData);
  }
}
