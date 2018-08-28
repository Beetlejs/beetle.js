import { EntityType } from "./metadata";

export function getKey(entity, type: EntityType) {
    if (type)
        return type.keys.map(k => entity[k]).join(';');

    const k = entity['id'] || entity['Id'] || null;
    return k ? String(k) : null;
}
