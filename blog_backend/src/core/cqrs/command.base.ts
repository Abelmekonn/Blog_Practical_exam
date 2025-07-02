export interface ICommand<T = void> {
  readonly _type?: string;
}

export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  execute(command: TCommand): Promise<TResult>;
}