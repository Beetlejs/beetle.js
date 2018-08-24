import { EntityType } from "../metadata";
import { IEntity } from "../types";

export enum EntityState {
    Detached = 0,
    Unchanged = 1,
    Deleted = 2,
    Modified = 3,
    Added = 4
}

export class EntityEntry<T = any> {

    constructor(public readonly entity: T, public readonly type: EntityType, public readonly state = EntityState.Added) {
        this.originalValues = new Map();
    }

    readonly originalValues: Map<string, any>;
}

export class EntityStore {
    entities = new Map<string, IEntity>();
}

export interface TrackingInfo {
    type: string;
    state: EntityState;
}

export interface TrackedEntity {
    tracking: TrackingInfo;
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