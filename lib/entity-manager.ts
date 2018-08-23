import { Entity } from "./types";
import { EntityEntry } from "./tracking";
import { TrackedEntity } from "./tracking";

export abstract class EntityManagerBase {

    mergeEntities(entities: Entity[]) {
    }

    saveChanges(entries: EntityEntry[]) {
    }

    saveEntities(entities: TrackedEntity[]) {
    }
}
