import { IEntity } from "../types";
import { PropertyValidator, ValidationError } from "./validation";

interface MetadataPart {
    name: string;
    displayName?: string;

    toString(): string;
    validate(entity: IEntity): ValidationError[];
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
    checkAssign(entity: IEntity);
}

export class EntityType {
    dataProperties: DataProperty[] = [];
    navigationProperties: NavigationProperty[] = [];

    create() {
        const o = {};
        this.dataProperties.forEach(d => o[d.name] = d.defaultValue);
        this.navigationProperties.forEach(n => o[n.name] = n.isScalar ? null : []);
        return o;
    }
}
