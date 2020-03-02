import { Ctor, AjaxOptions, IRequestProvider } from 'jinqu';
import { Context, ContextOptions } from "../context";
import { getTypeName } from '../helper';
import { IEntity, EntityBase, BeetleQueryOptions } from '../shared';
import { EntitySet } from "./entity-set";

export class BeetleLinqContext<
    TServiceOptions extends AjaxOptions = AjaxOptions,
    TOptions extends TServiceOptions & BeetleQueryOptions = TServiceOptions & BeetleQueryOptions>
    extends Context<TServiceOptions, TOptions>
    implements IRequestProvider<BeetleQueryOptions> {

    constructor(options: ContextOptions<TServiceOptions> = {}) {
        super(options);
    }

    private readonly _sets: Map<string, EntitySet<any>> = new Map<string, EntitySet<any>>();

    set<T extends IEntity, TResponse>(type: (typeof EntityBase & Ctor<T>) | string, path: string): EntitySet<T> {
        const t = getTypeName(type);

        if (this._sets.has(t))
            return this._sets.get(t);

        const set = new EntitySet<T>(this.store<T>(t), path || t);
        this._sets[t] = set;
        return set;
    }
}
