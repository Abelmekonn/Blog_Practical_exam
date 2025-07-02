import { ICommand } from '../../../core/cqrs/command.base';

export class UpdateUserCommand implements ICommand<void> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
  ) {}
}