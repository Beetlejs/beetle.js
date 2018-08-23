import { IEntity } from "../types";
import { EntityManager } from "../entity-manager";

export interface ValidationError {
    message: string;
    entity: IEntity;
    property?: string;
    value?: any;
}

export interface EntityValidationError {
    entity: IEntity;
    validationErrors: ValidationError[];
}

export interface ManagerValidationError extends Error {
    entities: IEntity[];
    entitiesInError: EntityValidationError[];
    manager: EntityManager;
}

export interface Validator {
    name: string;
    message: string;
    args?: any;
}

export interface PropertyValidator extends Validator {
    validate(value: any, entity: IEntity): string;
}

export interface EntityValidator extends Validator {
    validate(entity: IEntity): string;
}
