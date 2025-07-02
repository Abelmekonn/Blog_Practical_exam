import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../config/database.config';

// Import ORM entities
import { User } from './entities/user.orm-entity';
import { Post } from './entities/post.orm-entity';
import { Comment } from './entities/comment.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Post, Comment]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
