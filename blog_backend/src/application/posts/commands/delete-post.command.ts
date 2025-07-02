import { ICommand } from '../../../core/cqrs/command.base';

export class DeletePostCommand implements ICommand<void> {
  readonly _type = 'DeletePost';

  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
