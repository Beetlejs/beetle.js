import { Entity } from "../types";
import { EntityManagerBase } from "../entity-manager";

export interface ValidationError {
    message: string;
    entity: Entity;
    property?: string;
    value?: any;
}

export interface EntityValidationError {
    entity: Entity;
    validationErrors: ValidationError[];
}

export interface ManagerValidationError extends Error {
    entities: Entity[];
    entitiesInError: EntityValidationError[];
    manager: EntityManagerBase;
}

export interface Validator {
    name: string;
    message: string;
    args?: any;
}

export interface PropertyValidator extends Validator {
    validate(value: any, entity: Entity): string;
}

export interface EntityValidator extends Validator {
    validate(entity: Entity): string;
}

interface MetadataPart {
    name: string;
    displayName?: string;

    toString(): string;
    validate(entity: Entity): ValidationError[];
}

export interface Property extends MetadataPart {
    owner: EntityType;
    isComplex: boolean;
    validators: PropertyValidator[];
}

interface DataTypeBase {
    name: string;

    toString(): string;
    isValid(value: any): boolean;
    defaultValue(): any;
    autoValue(): any;
}

export interface DataProperty extends Property {
    dataType: DataTypeBase;
    isNullable: boolean;
    isKeyPart: boolean;
    // generationPattern?: enums.generationPattern;
    defaultValue: any;
    useForConcurrency: boolean;
    relatedNavigationProperties: NavigationProperty[];
    isEnum: boolean;

    isValid(value: any): boolean;
    handle(value: any): any;
    getDefaultValue(): any;
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

export interface EntityType extends MetadataPart {
    dataProperties: DataProperty[];
    navigationProperties: NavigationProperty[];
    shortName: string;
    keys: string[];
    baseTypeName: string;
    metadataManager: MetadataManager;
    properties: string[];
    floorType: EntityType;
    baseType: EntityType;
    validators: EntityValidator[];

    create();
}

export class MetadataManager {
}
