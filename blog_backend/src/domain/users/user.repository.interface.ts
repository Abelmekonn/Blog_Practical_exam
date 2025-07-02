import { IBaseRepository } from '../../core/base/base.repository.interface';
import { User } from './user.entity';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');