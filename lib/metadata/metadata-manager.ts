import { Ctor } from "jinqu";
import { EntityType } from "./entity-type";
import { IEntity, EntityBase } from "../types";
import { getTypeName } from "../helper";

export class MetadataManager {
    private types: Map<string, EntityType>;

    getType(type: string): EntityType {
        return this.types.get(type);
    }

    addType(type: EntityType) {
        this.types.set(type.name, type);
    }
}

export class MetadataBuilder {

    constructor(private metadata: MetadataManager) {
    }

    private type(type: string) {
        if (!this.metadata.getType(type)) {
            const et = new EntityType();
            this.metadata.addType(et);

            return et;
        }
    }
    
    entity<T extends IEntity>(type: (typeof EntityBase) | Ctor<T> | string) {
        const t = getTypeName(type);
        let et = this.metadata.getType(t);
        if (!et) {
            et = new EntityType();
        }
    }
}
