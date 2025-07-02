import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsModule as ApplicationCommentsModule } from '../../application/comments/comments.module';

@Module({
  imports: [ApplicationCommentsModule],
  controllers: [CommentsController],
})
export class CommentsPresentationModule {}