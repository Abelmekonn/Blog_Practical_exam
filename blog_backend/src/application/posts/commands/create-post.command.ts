import { ICommand } from '../../../core/cqrs/command.base';

export class CreatePostCommand implements ICommand<string> {
  readonly _type = 'CreatePost';
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly imageUrl?: string,
    public readonly imagePublicId?: string,
  ) {}
}
