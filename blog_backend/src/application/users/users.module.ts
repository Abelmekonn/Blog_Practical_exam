import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure/repositories.module';

// Commands
import { UpdateUserHandler } from './commands/update-user.handler';

// Queries
import { GetUserHandler } from './queries/get-user.handler';

@Module({
  imports: [RepositoriesModule],
  providers: [
    // Command Handlers
    UpdateUserHandler,

    // Query Handlers
    GetUserHandler,
  ],
  exports: [UpdateUserHandler, GetUserHandler],
})
export class UsersModule {}
