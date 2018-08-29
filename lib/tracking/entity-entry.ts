import { IEntity } from "../types";
import { EntityState } from "./entity-state";
import { EntityType } from "../metadata";
import { getKey } from '../helper';

export interface EntityEntryEvents {
    stateChanged?: (entry: EntityEntry, oldState: EntityState) => void;
    keyChanged?: (entry: EntityEntry, oldKey: string) => void;
}

export class EntityEntry<T extends IEntity = any> {

    constructor(private callbacks: EntityEntryEvents, public readonly entity: T, 
                public readonly type?: EntityType, state = EntityState.Added) {
        this._originalValues = getOriginalValues(entity, type);
        this.key = getKey(entity, type);
        this.state = state;
    }

    private _state: EntityState;
    get state() {
        return this._state;
    }
    set state(value) {
        if (value === EntityState.Unchanged) {
            this._originalValues = getOriginalValues(this.entity, this.type);
        }
        this.state = value;
    }
    
    private _originalValues: Map<string, any>;
    get originalValues() {
        return this._originalValues;
    }

    readonly key: string;

    overwrite(values?: any, state?: EntityState) {
        if (!values) return;

        for (let p in values) {

        }
    }

    clearNavigations() {
    }
}

function getOriginalValues(entity, type: EntityType) {
    const m = new Map();
    if (type) {
        type.dataProperties.forEach(p => {
            m[p.name] = entity[p.name];
        });
    } else {
        for (let p in entity) {
            const v = entity[p];
            if (v == null || v instanceof Date || v !== Object(v)) {
                m[p] = v;
            }
        }
    }

    return m;
}

export interface TrackingInfo {
    type: string;
    state: EntityState;
}

export interface TrackedEntity {
    tracking: TrackingInfo;
}