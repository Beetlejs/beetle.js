import { IEntity } from "../types";
import { EntityState } from "./entity-state";
import { EntityType } from "../metadata";
import { getKey } from '../helper';

export interface EntityEntryEvents {
    stateChanged?: (entry: EntityEntry, oldState: EntityState) => void;
}

export class EntityEntry<T extends IEntity = any> {

    constructor(public readonly entity: T, state = EntityState.Added,
        public readonly type?: EntityType, private callbacks?: EntityEntryEvents) {
        this._key = getKey(entity, type);
        this.state = state;
    }

    private _state: EntityState;
    get state() {
        return this._state;
    }
    set state(value) {
        if (value === this.state) return;

        if (value === EntityState.Unchanged) {
            this._originalValues = getOriginalValues(this.entity);
        }

        const os = this.state;
        this._state = value;

        if (this.callbacks.stateChanged) {
            this.callbacks.stateChanged(this, os);
        }
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
        if (this._state === EntityState.Unchanged) {
            this.detectChanges();
        }

        return this._state !== EntityState.Detached && this._state !== EntityState.Unchanged;
    }

    overwrite(values?) {
        this.merge(values);
    }

    accept(values?) {
        this.merge(values);

        this.state = EntityState.Unchanged;

        this._key = getKey(this.entity, this.type);
    }

    private merge(values) {
        if (values) {
            for (let p in values) {
                this.entity[p] = values[p];
            }
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

    detectChanges() {
        if (this.state !== EntityState.Unchanged) return;

        for (let [k, v] of this.originalValues.entries()) {
            if (this.entity[k] !== v) {
                this.state = EntityState.Modified;
                return;
            }
        }
    }

    getTrackingInfo(): TrackingInfo {
        return {
            state: this.state,
            originalValues: this.originalValues
        };
    }
}

function getOriginalValues(entity) {
    const m = new Map();
    for (let p in entity) {
        const v = entity[p];
        if (v == null || v instanceof Date || v !== Object(v)) {
            m.set(p, v);
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
