import { IEntity } from "./types";
import { EntityEntry, EntityStore, EntityState } from "./tracking";
import { MetadataManager } from "./metadata";

export abstract class Context {

    constructor(protected readonly metadata: MetadataManager) {
    }

    private _stores: Map<string, EntityStore<any>>;

    protected store<T extends IEntity>(type: string): EntityStore<T> {
        if (this._stores.has(type))
            return this._stores[type] = new EntityStore<T>(this.metadata.getType(type));
        return this._stores[type];
    }
    
    protected mergeEntities(entities: IEntity[] | IEntity, state = EntityState.Unchanged) {
        if (!entities) return;

        if (!(entities instanceof Array)) {
            entities = [entities];
        }

        for (const entity of entities) {
            if (!entity.$type)
                throw new Error('Cannot merge an entity without $type information');

            const store = this.store(entity.$type);
        }
    }

    saveChanges() {
    }

    saveEntries(entries: EntityEntry[]) {
    }
}
