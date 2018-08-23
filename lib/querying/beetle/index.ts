import { IQueryProvider, IQueryPart, Query, QueryPart, PartArgument } from 'jinqu';
import { IWebRequestOptions, RequestProvider } from "../../types";

export interface BeetleQueryOptions extends IWebRequestOptions {
}

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this._create(QueryPart.create('options', [PartArgument.literal(options)]));
    }

    private _create<TResult = T>(part: IQueryPart): BeetleQuery<TResult> {
        return <any>this.provider.createQuery([...this.parts, part]);
    }
}

export class BeetleQueryProvider implements IQueryProvider {

    constructor(protected requestProvider: RequestProvider<BeetleQueryOptions>) {
    }

    createQuery<T>(parts?: IQueryPart[]) {
        return new Query<T>(this, parts);
    }

    execute<T = any, TResult = PromiseLike<T>>(parts: IQueryPart[]): TResult {
        throw new Error('Not implemented');
    }
}
