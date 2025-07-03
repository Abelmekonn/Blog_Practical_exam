import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure/repositories.module';

// Commands
import { CreatePostHandler } from './commands/create-post.handler';
import { UpdatePostHandler } from './commands/update-post.handler';
import { DeletePostHandler } from './commands/delete-post.handler';

// Queries
import { GetPostHandler } from './queries/get-post.handler';
import { GetPostsHandler } from './queries/get-posts.handler';

@Module({
  imports: [RepositoriesModule],
  providers: [
    // Command Handlers
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,

    // Query Handlers
    GetPostHandler,
    GetPostsHandler,
  ],
  exports: [
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,
    GetPostHandler,
    GetPostsHandler,
  ],
})
export class PostsModule {}
