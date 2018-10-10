import { MergeStrategy } from "./tracking/merge-strategy";

export interface IEntity {
    $type: string;
}

export class EntityBase implements IEntity {
    $type: string;
    static $type: string;
}

export interface QueryOptions {
    merge?: MergeStrategy;
}

export interface SaveResult {
    affectedCount?: number;
    updatedEntities?: Array<{index: number, values: any}>;
}
