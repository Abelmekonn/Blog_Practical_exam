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

  async findById(id: string): Promise<Post | null> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.imageUrl',
        'post.imagePublicId',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.email',
        'author.createdAt',
        'author.updatedAt',
        // password excluded
      ])
      .where('post.id = :id', { id })
      .getOne();
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.imageUrl',
        'post.imagePublicId',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.email',
        'author.createdAt',
        'author.updatedAt',
        // password excluded
      ])
      .where('post.author.id = :authorId', { authorId })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  async findWithComments(id: string): Promise<Post | null> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.imageUrl',
        'post.imagePublicId',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.email',
        'author.createdAt',
        'author.updatedAt',
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'commentAuthor.id',
        'commentAuthor.username',
        'commentAuthor.email',
        // passwords excluded for all users
      ])
      .where('post.id = :id', { id })
      .getOne();
  }

  async findAllPaginated(
    limit: number,
    offset: number,
    search?: string,
  ): Promise<Post[]> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.imageUrl',
        'post.imagePublicId',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.email',
        'author.createdAt',
        'author.updatedAt',
        // password excluded
      ])
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (search) {
      query.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async findByAuthorIdPaginated(
    authorId: string,
    limit: number,
    offset: number,
    search?: string,
  ): Promise<Post[]> {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.imageUrl',
        'post.imagePublicId',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.username',
        'author.email',
        'author.createdAt',
        'author.updatedAt',
        // password excluded
      ])
      .where('post.author.id = :authorId', { authorId })
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (search) {
      query.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async count(authorId?: string, search?: string): Promise<number> {
    const query = this.postRepository.createQueryBuilder('post');

    if (authorId) {
      query.where('post.author.id = :authorId', { authorId });
    }

    if (search) {
      const whereCondition = authorId ? 'AND' : 'WHERE';
      query.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getCount();
  }
}
