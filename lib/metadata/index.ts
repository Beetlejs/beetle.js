export interface Property {
    name: string;
}

export enum DataType {
    number, string, boolean, date
}

export interface DataProperty extends Property {
    dataType: DataType;
    defaultValue: any;
}

export interface NavigationProperty extends Property {
    typeName: string;
    type: EntityType;
    isScalar: boolean;
    associationName: string;
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
    baseType: EntityType;
    floorType: EntityType;
    metadataManager: MetadataManager;
    properties: string[];
}

export class MetadataManager {
    types: EntityType[];
}
