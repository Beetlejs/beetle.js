import { IEntity } from "../types";
import { PropertyValidator, ValidationError } from "./validation";

interface MetadataPart {
    name: string;
    displayName?: string;

    toString(): string;
    validate(entity: IEntity): ValidationError[];
}

interface Property extends MetadataPart {
    owner: EntityType;
    isComplex: boolean;
    validators: PropertyValidator[];
}

export interface DataProperty extends Property {
    name: string;
    displayName?: string;
    defaultValue: any;
}

export interface NavigationProperty {
    name: string;
}

export class EntityType {
    dataProperties: DataProperty[];
    navigationProperties: NavigationProperty[];

    create() {
        const o = {};
        this.dataProperties.forEach(d => o[d.name] = d.defaultValue);
        this.navigationProperties.forEach();
    }
}
