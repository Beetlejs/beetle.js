export enum EntityState {
    Detached = 0,
    Unchanged = 1,
    Deleted = 2,
    Modified = 3,
    Added = 4
}

export class EntityEntry<T = any> {
    state: EntityState;
    originalValues: any;
}

export class EntityStore<T> {

    constructor(public readonly type: string) {

    }

    entries: EntityEntry[];
}

export interface TrackingInfo {
    type: string;
    state: EntityState;
}

export interface TrackedEntity {
    tracking: TrackingInfo;
}
