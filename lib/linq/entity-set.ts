import { IQuery, IRequestProvider } from "jinqu";
import { QueryOptions, LinqQuery, LinqQueryProvider } from "linquest";
import { IEntity, BeetleQueryOptions, IEntitySet } from "../types";
import { EntityStore, EntityState, MergeStrategy } from "../tracking";
import { Context } from "../context";

export class EntitySet<T extends IEntity> extends LinqQuery<T, BeetleQueryOptions> implements IEntitySet<T> {

    constructor(private readonly store: EntityStore<T>) {
        super(new LinqQueryProvider(store.context));

        this.local = store.local;
    }

    readonly local: IQuery<T>;

    asNoTracking() {
        return this.withOptions({ merge: MergeStrategy.NoTracking });
    }

    add(entity:  T) {
        return this.store.merge(entity, EntityState.Added);
    }

    attach(entity:  T) {
        return this.store.merge(entity);
    }
}
