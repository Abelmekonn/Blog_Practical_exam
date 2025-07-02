import { ICommand } from '../../../core/cqrs/command.base';

export class CreateCommentCommand implements ICommand<string> {
  readonly _type = 'CreateComment';

  constructor(
    public readonly content: string,
    public readonly postId: string,
    public readonly authorId: string,
  ) {}
}
