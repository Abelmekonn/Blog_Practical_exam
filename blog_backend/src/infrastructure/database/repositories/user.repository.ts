import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/users/user.entity';
import { IUserRepository } from '../../../domain/users/user.repository.interface';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}