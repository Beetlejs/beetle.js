import { Ctor } from "jinqu";
import { EntityType } from "./metadata";
import { IEntity, EntityBase } from "./types";

export function getKey(entity, type: EntityType) {
    if (type)
        return type.keys.map(k => entity[k]).join(';');

    const k = entity['id'] || entity['Id'] || null;
    return k ? String(k) : null;
}

export function getTypeName<T extends IEntity>(type: (typeof EntityBase) | Ctor<T> | string) {
    if (typeof type === 'string') return type;

    if ('$type' in type) return type.$type;

    return getClassName(type);
}

export function getClassName<T>(type: Ctor<T>) {
    return type.constructor.name;
}
