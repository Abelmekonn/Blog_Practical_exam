import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../config/database.config';

// Import entities
import { User } from '../../domain/users/user.entity';
import { Post } from '../../domain/posts/post.entity';
import { Comment } from '../../domain/comments/comment.entity';

// Import repositories
import { UserRepository } from './repositories/user.repository';
import { PostRepository } from './repositories/post.repository';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Post, Comment]),
  ],
  providers: [UserRepository, PostRepository, CommentRepository],
  exports: [UserRepository, PostRepository, CommentRepository],
})
export class DatabaseModule {}