import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure/repositories.module';

// Commands
import { CreateCommentHandler } from './commands/create-comment.handler';
import { DeleteCommentHandler } from './commands/delete-comment.handler';

// Queries
import { GetCommentsByPostHandler } from './queries/get-comments-by-post.handler';

@Module({
  imports: [RepositoriesModule],
  providers: [
    // Command Handlers
    CreateCommentHandler,
    DeleteCommentHandler,

    // Query Handlers
    GetCommentsByPostHandler,
  ],
  exports: [
    CreateCommentHandler,
    DeleteCommentHandler,
    GetCommentsByPostHandler,
  ],
})
export class CommentsModule {}
