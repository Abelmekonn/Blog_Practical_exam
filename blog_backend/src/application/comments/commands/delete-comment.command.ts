import { ICommand } from '../../../core/cqrs/command.base';

export class DeleteCommentCommand implements ICommand<void> {
  constructor(public readonly id: string) {}
}