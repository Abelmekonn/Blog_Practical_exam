import { IQuery } from '../../../core/cqrs/query.base';

export class GetPostsQuery implements IQuery<any[]> {
  readonly _type = 'GetPosts';

  constructor(
    public readonly authorId?: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}
