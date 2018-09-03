import { Ctor } from "jinqu";
import { DataProperty } from "./data-property";
import { NavigationProperty } from "./navigation-property";
import { MetadataManager } from "./metadata-manager";

export class EntityType {

    constructor(public readonly metadata: MetadataManager, public readonly name: string) {
    }
    
    readonly keys: string[] = [];
    readonly dataProperties: Map<string, DataProperty> = new Map();
    readonly navigationProperties: Map<string, NavigationProperty> = new Map();
    jsType: Ctor<any>;
}

export class EntityBuilder {
}