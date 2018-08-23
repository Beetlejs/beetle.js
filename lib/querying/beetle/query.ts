import { Query, QueryPart, PartArgument, IQueryPart } from 'jinqu';
import { BeetleQueryOptions } from './query-options';

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this._create(QueryPart.create('options', [PartArgument.literal(options)]));
    }

    private _create<TResult = T>(part: IQueryPart): BeetleQuery<TResult> {
        return <any>this.provider.createQuery([...this.parts, part]);
    }
}
