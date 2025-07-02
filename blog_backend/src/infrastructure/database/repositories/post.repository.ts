import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.orm-entity';
import { IPostRepository } from '../../../domain/posts/post.repository.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class PostRepository
  extends BaseRepository<Post>
  implements IPostRepository
{
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    super(postRepository);
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.postRepository.find({ where: { id: authorId } });
  }

  async findWithComments(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }
}
