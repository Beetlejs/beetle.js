import { IQuery } from "jinqu";
import { LinqQuery, LinqQueryProvider } from "linquest";
import { IEntity, BeetleQueryOptions, IEntitySet } from "../types";
import { EntityStore, EntityState, MergeStrategy } from "../tracking";
import { createBaseParts } from "../helper";

export class EntitySet<T extends IEntity> extends LinqQuery<T, BeetleQueryOptions> implements IEntitySet<T> {

    constructor(private readonly store: EntityStore<T>, private readonly path: string) {
        super(new LinqQueryProvider(store.context), createBaseParts(path));

        this.local = store.local;
    }

    readonly local: IQuery<T>;

    asNoTracking() {
        return this.withOptions({ merge: MergeStrategy.NoTracking, url: this.path });
    }

    add(entity: T) {
        return this.store.merge(entity, EntityState.Added);
    }

    attach(entity: T) {
        return this.store.merge(entity);
    }
}
