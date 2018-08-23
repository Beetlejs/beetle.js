import { IEntity } from "./types";
import { EntityEntry } from "./tracking";
import { TrackedEntity } from "./tracking";

export abstract class EntityManagerBase {

    mergeEntities(entities: IEntity[]) {
    }

    saveChanges(entries: EntityEntry[]) {
    }

    saveEntities(entities: TrackedEntity[]) {
    }
}
