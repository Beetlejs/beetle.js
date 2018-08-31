import { IQuery } from "jinqu";
import { IEntity, IRequestProvider, BeetleQueryOptions } from "../types";
import { BeetleQuery } from "./beetle-query";
import { BeetleQueryProvider } from "./beetle-query-provider";
import { EntityStore, EntityState } from "../tracking";

export class EntitySet<T extends IEntity> extends BeetleQuery<T> {

    constructor(private readonly store: EntityStore<T>, requestProvider: IRequestProvider<BeetleQueryOptions>) {
        super(new BeetleQueryProvider(requestProvider));

        this.local = store.local;
    }

    readonly local: IQuery<T>;

    add(entity:  T) {
        this.store.merge(entity, EntityState.Added);
    }

    attach(entity:  T) {
        this.store.merge(entity);
    }
}
