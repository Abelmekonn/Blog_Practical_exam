import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';

// Import entities
import { User } from '../../infrastructure/database/entities/user.orm-entity';
import { Post } from '../../infrastructure/database/entities/post.orm-entity';
import { Comment } from '../../infrastructure/database/entities/comment.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
