import { IQuery } from '../../../core/cqrs/query.base';

export class GetCommentsByPostQuery implements IQuery<any[]> {
  constructor(public readonly postId: string) {}
}