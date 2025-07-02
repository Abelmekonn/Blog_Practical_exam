import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

// Import repository interfaces and tokens
import { IUserRepository, USER_REPOSITORY } from '../domain/users/user.repository.interface';
import { IPostRepository, POST_REPOSITORY } from '../domain/posts/post.repository.interface';
import { ICommentRepository, COMMENT_REPOSITORY } from '../domain/comments/comment.repository.interface';

// Import repository implementations
import { UserRepository } from './database/repositories/user.repository';
import { PostRepository } from './database/repositories/post.repository';
import { CommentRepository } from './database/repositories/comment.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: POST_REPOSITORY,
      useClass: PostRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },
  ],
  exports: [USER_REPOSITORY, POST_REPOSITORY, COMMENT_REPOSITORY],
})
export class RepositoriesModule {}