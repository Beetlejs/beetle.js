import { EntityType } from "./entity-type";

export class NavigationProperty {
    name: string;
    typeName: string;
    type: EntityType;
    isScalar: boolean;
    associationName: string;
    foreignKeyNames: string[];
    inverse?: NavigationProperty;
}
