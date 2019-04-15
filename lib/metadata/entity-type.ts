import { Ctor } from "jinqu";
import { NavigationProperty } from "./navigation-property";
import { MetadataManager } from "./metadata-manager";
import { IEntity, EntityBase } from "../shared";

export class EntityType {

    constructor(public readonly metadata: MetadataManager, public readonly name: string) {
    }
    
    readonly keys: string[] = [];
    readonly navigationProperties: Map<string, NavigationProperty> = new Map();
    jsType?: Ctor<any>;
}

export class EntityBuilder {

    constructor(public readonly type: EntityType) {
    }

    navigation(name: string) {
    }

    jsType(type: (typeof EntityBase & Ctor<IEntity>)) {
    }
}
