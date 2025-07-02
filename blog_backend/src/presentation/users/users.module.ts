import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule as ApplicationUsersModule } from '../../application/users/users.module';

@Module({
  imports: [ApplicationUsersModule],
  controllers: [UsersController],
})
export class UsersPresentationModule {}