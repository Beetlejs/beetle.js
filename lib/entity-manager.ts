import { IEntity } from "./types";
import { EntityEntry } from "./tracking";
import { IRequestProvider } from './querying';

export abstract class Context {

    constructor() {
    }

    private mergeEntities(entities: IteratorResult<IEntity> | IEntity) {
    }

    saveChanges() {
    }

    saveEntries(entries: EntityEntry[]) {
    }
}
