import { Ctor } from 'jinqu';
import { FetchAjaxProvider } from 'linquest';
import { Context } from "../context";
import { getTypeName } from '../helper';
import { MetadataManager } from '../metadata';
import { IEntity, EntityBase } from '../types';
import { EntitySet } from "./entity-set";

export class BeetleLinqContext extends Context {

    constructor(metadata?: MetadataManager) {
        super(metadata, new FetchAjaxProvider());
    }

    private _sets: Map<string, EntitySet<any>>;

    set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): EntitySet<T> {
        const t = getTypeName(type);

        if (this._sets.has(t))
            return this._sets[t];

        return this._sets[t] = new EntitySet<T>(this.store<T>(t));
    }
}
