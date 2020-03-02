import { IQuery } from "jinqu";
import { QueryOptions } from "linquest";
import { MergeStrategy, EntityEntry } from "./tracking";

export interface IEntity {
    $type: string;
}

export class EntityBase implements IEntity {
    $type: string;
    static $type: string;
}

export interface BeetleQueryOptions extends QueryOptions {
    merge?: MergeStrategy;
}

export interface IEntitySet<T extends IEntity> extends IQuery<T> {
    readonly local: IQuery<T>;
    asNoTracking(): IQuery<T>;
    add(entity:  T): EntityEntry<T>;
    attach(entity:  T): EntityEntry<T>;
}

export interface SaveResult {
    affectedCount?: number;
    updatedEntities?: Array<{index: number, values: any}>;
}
