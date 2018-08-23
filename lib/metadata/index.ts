import { Entity } from "../types";
import { EntityManagerBase } from "../entity-manager";

export interface Property {
    name: string;
    displayName?: string;
}

export interface DataTypeBase {
    name: string;

    toString(): string;
    defaultValue(): any;
}

export interface DataProperty extends Property {
    dataType: DataTypeBase;
    defaultValue: any;
    useForConcurrency: boolean;
}

export interface NavigationProperty extends Property {
    entityTypeName: string;
    entityType: EntityType;
    isScalar: boolean;
    associationName: string;
    cascadeDelete: boolean;
    foreignKeyNames: string[];
    foreignKeys: DataProperty[];
    inverse?: NavigationProperty;
}

export interface EntityType extends Property {
    dataProperties: DataProperty[];
    navigationProperties: NavigationProperty[];
    shortName: string;
    keys: string[];
    baseTypeName: string;
    metadataManager: MetadataManager;
    properties: string[];
    floorType: EntityType;
    baseType: EntityType;

    create();
}

export class MetadataManager {
    types: EntityType[];
}
