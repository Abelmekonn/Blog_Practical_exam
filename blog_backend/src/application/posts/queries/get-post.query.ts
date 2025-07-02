import { IQuery } from '../../../core/cqrs/query.base';

export class GetPostQuery implements IQuery<any> {
  constructor(public readonly id: string) {}
}