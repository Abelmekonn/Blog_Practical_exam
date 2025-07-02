import { IQuery } from '../../../core/cqrs/query.base';

export class GetUserQuery implements IQuery<any> {
  constructor(public readonly id: string) {}
}