import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsModule as ApplicationPostsModule } from '../../application/posts/posts.module';

@Module({
  imports: [ApplicationPostsModule],
  controllers: [PostsController],
})
export class PostsPresentationModule {}
