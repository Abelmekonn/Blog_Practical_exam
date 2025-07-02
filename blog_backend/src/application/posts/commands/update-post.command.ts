import { ICommand } from '../../../core/cqrs/command.base';

export class UpdatePostCommand implements ICommand<void> {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly imageUrl?: string,
    public readonly imagePublicId?: string,
  ) {}
}