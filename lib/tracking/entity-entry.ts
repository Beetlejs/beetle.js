import { IEntity } from "../types";
import { EntityState } from "./entity-state";
import { EntityType } from "../metadata";
import { getKey } from '../helper';

export interface EntityEntryEvents {
    stateChanged?: (entry: EntityEntry, oldState: EntityState) => void;
    keyChanged?: (entry: EntityEntry, oldKey: string) => void;
}

export class EntityEntry<T extends IEntity = any> {

    constructor(public readonly entity: T, state = EntityState.Added,
        public readonly type?: EntityType, private callbacks?: EntityEntryEvents) {
        this._key = getKey(entity, type);
        this._state = state;
    }

    private _state: EntityState;
    get state() {
        return this._state;
    }
    set state(value) {
        if (value === this.state) return;
        
        if (value === EntityState.Unchanged) {
            this._originalValues = getOriginalValues(this.entity, this.type);
        }

        const os = this.state;
        this.state = value;
    }

    private _originalValues: Map<string, any>;
    get originalValues() {
        return this._originalValues;
    }

    private _key: string;
    get key(): string {
        return this._key;
    }

    isChanged() {
        return this._state !== EntityState.Detached && this._state !== EntityState.Unchanged;
    }

    overwrite(values?: any, state?: EntityState) {
        if (values) {
            for (let p in values) {
                this.entity[p] = values[p];
            }
        }

        if (state != null) {
            this.state = state;
        } 
    }

    clearNavigations() {
        if (!this.type) return;
        
        this.type.navigationProperties.forEach(n => {
            if (n.isScalar) {
                this.entity[n.name] = null;
            }
            else {
                this.entity[n.name] = [];
            }
        });
    }

    getTrackingInfo(): TrackingInfo {
        return {
            state: this.state,
            originalValues: this.originalValues
        };
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
    state: EntityState;
    originalValues: Map<string, any>;
}

export interface TrackedEntity extends IEntity {
    tracking: TrackingInfo;
}
