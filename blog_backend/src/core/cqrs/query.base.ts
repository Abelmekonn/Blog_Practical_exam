export interface IQuery<T = void> {
  readonly _type?: string;
}

export interface IQueryHandler<TQuery extends IQuery, TResult = void> {
  execute(query: TQuery): Promise<TResult>;
}