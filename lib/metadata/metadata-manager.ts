import { Ctor } from "jinqu";
import { EntityType, EntityBuilder } from "./entity-type";
import { IEntity, EntityBase } from "../types";
import { getTypeName } from "../helper";

export class MetadataManager {
    private types: Map<string, EntityType> = new Map();

    getType(type: string): EntityType {
        return this.types.get(type);
    }

    addType(type: EntityType) {
        this.types.set(type.name, type);
    }
}

export class MetadataBuilder {

    constructor(private readonly metadata: MetadataManager) {
    }

    private type(type: string) {
        let et = this.metadata.getType(type);
        if (!et) {
            et = new EntityType(this.metadata, type);
            this.metadata.addType(et);
        }

        return et;
    }
    
    entity<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string) {
        let t, jst;
        if (typeof type === 'string') {
            t = type;
        }
        else {
            t = type.$type;
            jst = type;
        }
    
        
        let et = this.metadata.getType(t);
        if (!et) {
            et = new EntityType(this.metadata, t);
            this.metadata.addType(et);
        }
        et.jsType = jst;

        return new EntityBuilder(et);
    }
}
