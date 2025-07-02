import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoriesModule } from './infrastructure/repositories.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './application/posts/posts.module';
import { CommentsModule } from './application/comments/comments.module';
import { UsersModule } from './application/users/users.module';

// Presentation modules
import { PostsPresentationModule } from './presentation/posts/posts.module';
import { CommentsPresentationModule } from './presentation/comments/comments.module';
import { UsersPresentationModule } from './presentation/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RepositoriesModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    PostsPresentationModule,
    CommentsPresentationModule,
    UsersPresentationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
