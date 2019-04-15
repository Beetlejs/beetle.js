import { Ctor } from 'jinqu';
import { Context } from "../context";
import { getTypeName } from '../helper';
import { IEntity, EntityBase } from '../shared';
import { EntitySet } from "./entity-set";

export class BeetleLinqContext extends Context {

    private readonly _sets: Map<string, EntitySet<any>> = new Map<string, EntitySet<any>>();

    set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string, path: string): EntitySet<T> {
        const t = getTypeName(type);

        if (this._sets.has(t))
            return this._sets.get(t);

        const set = new EntitySet<T>(this.store<T>(t), path || t);
        this._sets[t] = set;
        return set;
    }
}
