import { IQueryProvider, IQueryPart, Query } from "jinqu";
import { RequestProvider } from '../../types';
import { BeetleQueryOptions } from "./query-options";

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
