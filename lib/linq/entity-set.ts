import { IQuery, IRequestProvider } from "jinqu";
import { LinqQueryProvider, LinqOptions, LinqQuery } from "linquest";
import { IEntity, QueryOptions } from "../types";
import { EntityStore, EntityState, MergeStrategy } from "../tracking";

export class EntitySet<T extends IEntity> extends LinqQuery<T, BeetleLinqOptions> {

    constructor(private readonly store: EntityStore<T>, requestProvider: IRequestProvider<BeetleLinqOptions, Response>) {
        super(new LinqQueryProvider<BeetleLinqOptions, Response>(requestProvider));

        this.local = store.local;
    }

    readonly local: IQuery<T>;

    asNoTracking() {
        return <EntitySet<T>>this.withOptions({ merge: MergeStrategy.NoTracking });
    }

    add(entity:  T) {
        return this.store.merge(entity, EntityState.Added);
    }

    attach(entity:  T) {
        return this.store.merge(entity);
    }
}

export declare type BeetleLinqOptions = LinqOptions & QueryOptions;
