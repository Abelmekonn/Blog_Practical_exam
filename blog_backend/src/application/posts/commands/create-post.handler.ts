import { Injectable, Inject } from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { CreatePostCommand } from './create-post.command';
import { POST_REPOSITORY } from '../../../domain/posts/post.repository.interface';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';

@Injectable()
export class CreatePostHandler implements ICommandHandler<CreatePostCommand, string> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const { title, content, authorId, imageUrl, imagePublicId } = command;
    
    const post = await this.postRepository.create({
      title,
      content,
      author: { id: authorId },
      imageUrl,
      imagePublicId,
    });

    return post.id;
  }
}