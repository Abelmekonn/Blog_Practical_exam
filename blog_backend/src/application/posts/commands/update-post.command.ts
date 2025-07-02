import { ICommand } from '../../../core/cqrs/command.base';

export class UpdatePostCommand implements ICommand<void> {
  readonly _type = 'UpdatePost';

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly imageUrl?: string,
    public readonly imagePublicId?: string,
  ) {}
}
