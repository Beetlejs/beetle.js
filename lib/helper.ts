import { Ctor, QueryPart, AjaxFuncs, PartArgument } from "jinqu";
import { EntityType } from "./metadata";
import { IEntity, EntityBase } from "./shared";

export function getKey(entity, type: EntityType) {
    if (type)
        return type.keys.map(k => entity[k]).join(';');

    const k = entity['id'] || entity['Id'] || null;
    return k ? String(k) : null;
}

export function getTypeName<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string) {
    if (typeof type === 'string') return type;

    return type.$type;
}

export function getClassName<T>(type: Ctor<T>) {
    return type.constructor.name;
}

export function getForeignKey() {
}

export function combine<T = {[key: string]: string} | []>(src: T, dest: T) {
}

export function createBaseParts(url: string) {
    return [
        QueryPart.create(
            AjaxFuncs.options,
            [PartArgument.literal({ url: url })]
        )
    ]
}
