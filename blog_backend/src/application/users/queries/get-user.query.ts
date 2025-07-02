import { IQuery } from '../../../core/cqrs/query.base';

export class GetUserQuery implements IQuery<any> {
  readonly _type = 'GetUser';

  constructor(public readonly id: string) {}
}
