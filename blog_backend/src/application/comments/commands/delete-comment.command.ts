import { ICommand } from '../../../core/cqrs/command.base';

export class DeleteCommentCommand implements ICommand<void> {
  readonly _type = 'DeleteComment';

  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
