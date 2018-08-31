import { EntityType } from "./entity-type";

export class MetadataManager {
    types: Map<string, EntityType>;

    getType(type: string): EntityType {
        return this.types.get(type);
    }
}
