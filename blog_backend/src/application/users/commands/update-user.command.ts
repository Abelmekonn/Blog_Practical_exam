import { ICommand } from '../../../core/cqrs/command.base';

export class UpdateUserCommand implements ICommand<void> {
  readonly _type = 'UpdateUser';

  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly username?: string,
    public readonly avatarUrl?: string,
  ) {}
}
