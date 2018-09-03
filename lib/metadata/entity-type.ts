import { DataProperty } from "./data-property";
import { NavigationProperty } from "./navigation-property";
import { MetadataManager } from "./metadata-manager";

export class EntityType {

    constructor(public readonly metadata: MetadataManager, public readonly name: string) {
    }
    
    keys: string[] = [];
    dataProperties: Map<string, DataProperty> = new Map();
    navigationProperties: Map<string, NavigationProperty> = new Map();
}

export class EntityBuilder {
}