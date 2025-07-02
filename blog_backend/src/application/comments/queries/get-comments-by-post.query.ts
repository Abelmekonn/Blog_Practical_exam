import { IQuery } from '../../../core/cqrs/query.base';

export class GetCommentsByPostQuery implements IQuery<any[]> {
  readonly _type = 'GetCommentsByPost';

  constructor(public readonly postId: string) {}
}
