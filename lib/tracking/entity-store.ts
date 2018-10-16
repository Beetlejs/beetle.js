import { IEntity } from "../types";
import { EntityType } from "../metadata";
import { EntityEntry } from "./entity-entry";
import { EntityState } from "./entity-state";
import { MergeStrategy } from "./merge-strategy";
import { IQuery } from "jinqu";
import { Context } from "../context";
import { getKey } from "../helper";

export class EntityStore<T extends IEntity> {

    constructor(public readonly context: Context, private readonly type?: EntityType) {
        this.entities = [];
        this.entries = new Map<string, EntityEntry<T>>();
        this.allEntries = new Set<EntityEntry<T>>();
        this.local = this.entities.asQueryable();
    }

    private readonly entities: Array<T>;
    public readonly entries: Map<string, EntityEntry<T>>;
    public readonly allEntries: Set<EntityEntry<T>>;
    public readonly local: IQuery<T>;

    getByKey(key: string) {
        return this.entries.get(key);
    }

    merge(entity: T, state: EntityState = EntityState.Unchanged, merge: MergeStrategy = MergeStrategy.Preserve) {
        let entry: EntityEntry<T>;

        const key = getKey(entity, this.type);
        if (key) {
            entry = this.entries.get(key);
            if (entry != null) {
                if (merge === MergeStrategy.Throw)
                    throw new Error(`Store already has an entity with key ${key}`);
                
                if (merge === MergeStrategy.Overwrite) {
                    entry.overwrite(entity);
                    return entry;
                }

                return entry;
            }

            entry = new EntityEntry(entity, state, this.type, this);
            this.entries[key] = entry;
        }
        else {
            entry = new EntityEntry(entity, state, this.type, this);
        }

        this.allEntries.add(entry);
        this.entities.push(entity);

        return entry;
    }

    stateChanged(entry: EntityEntry, oldState: EntityState) {
        if (entry.state === EntityState.Detached) {
            this.entities.splice(this.entities.indexOf(entry.entity));
            this.allEntries.delete(entry);

            if (entry.key) {
                this.entries.delete(entry.key);
            }
        }
    }

    keyChanged(entry: EntityEntry, oldKey: string) {
        if (!oldKey && entry.key) {
            this.entries[entry.key] = entry;
        }
    }
}
