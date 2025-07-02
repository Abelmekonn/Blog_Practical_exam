import { ICommand } from '../../../core/cqrs/command.base';

export class DeletePostCommand implements ICommand<void> {
  constructor(public readonly id: string) {}
}