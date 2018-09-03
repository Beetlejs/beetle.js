import { DataProperty } from "./data-property";
import { NavigationProperty } from "./navigation-property";

export class EntityType {
    name: string;
    shortName: string;
    dataProperties: Map<string, DataProperty>
    navigationProperties: Map<string, NavigationProperty>;
    keys: string[];
    baseTypeName: string;
    baseType: EntityType;
    floorType: EntityType;
}

export class EntityBuilder {

}