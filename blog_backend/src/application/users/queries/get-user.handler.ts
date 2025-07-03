import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler } from '../../../core/cqrs/query.base';
import { GetUserQuery } from './get-user.query';
import { USER_REPOSITORY } from '../../../domain/users/user.repository.interface';
import { IUserRepository } from '../../../domain/users/user.repository.interface';
import { User } from '../../../domain/users/user.entity';

@Injectable()
export class GetUserHandler implements IQueryHandler<GetUserQuery, User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<User> {
    const { id } = query;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
