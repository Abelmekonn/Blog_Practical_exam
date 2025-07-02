import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '../../../core/cqrs/command.base';
import { UpdateUserCommand } from './update-user.command';
import { USER_REPOSITORY } from '../../../domain/users/user.repository.interface';
import { IUserRepository } from '../../../domain/users/user.repository.interface';

@Injectable()
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, void> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { id, name, email } = command;
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    await this.userRepository.update(id, updateData);
  }
}