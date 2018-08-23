import { IQueryProvider, IQueryPart, Query, QueryPart, PartArgument } from 'jinqu';
import { IEntity } from '../types';

export interface IWebRequestOptions {
}

export type QueryParameters = [{ key: string; value: string }];

export interface IRequestProvider<TOptions extends IWebRequestOptions> {
    call<T>(prms: QueryParameters, options: TOptions): Promise<IteratorResult<T>>
}

export interface BeetleQueryOptions extends IWebRequestOptions {
    noTracking?: boolean;
}

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this._create(QueryPart.create('options', [PartArgument.literal(options)]));
    }

    asNoTracking() {
        return this._create(QueryPart.create('options', [PartArgument.literal({ noTracking: true })]));
    }

    private _create<TResult = T>(part: IQueryPart): BeetleQuery<TResult> {
        return <any>this.provider.createQuery([...this.parts, part]);
    }
}

export class BeetleQueryProvider implements IQueryProvider {

    constructor(protected requestProvider: IRequestProvider<BeetleQueryOptions>) {
    }

    createQuery<T>(parts?: IQueryPart[]) {
        return new Query<T>(this, parts);
    }

    execute<T = any, TResult = PromiseLike<T>>(parts: IQueryPart[]): TResult {
        let o: BeetleQueryOptions = {};

        for (let p of parts) {
        }
    }
}

function handle(part: QueryPart) {
}

class EntityBase {
    static $type: string;
}

interface ITest {
    createSet<T extends EntityBase>(type: typeof EntityBase & (new (...args) => T));
    createSet<T extends IEntity>(type: string);
}

class Test implements ITest {
    createSet<T extends EntityBase>(type: typeof EntityBase);
    createSet<T extends IEntity>(type: string);
    createSet(type: any) {
    }
}

class Enti implements IEntity {
    $type: string;
    static $type = 'Enti';
}

const t = new Test();
t.createSet<Enti>(Enti);