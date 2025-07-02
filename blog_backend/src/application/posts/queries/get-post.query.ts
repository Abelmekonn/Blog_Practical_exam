import { IQuery } from '../../../core/cqrs/query.base';

export class GetPostQuery implements IQuery<any> {
  readonly _type = 'GetPost';

  constructor(public readonly id: string) {}
}
