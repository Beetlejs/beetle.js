import { Ctor, AjaxOptions, IRequestProvider } from 'jinqu';
import { Context, ContextOptions } from "../context";
import { getTypeName } from '../helper';
import { IEntity, EntityBase, BeetleQueryOptions } from '../shared';
import { EntitySet } from "./entity-set";
import { LinqService } from 'linquest';

export class BeetleLinqContext<
    TServiceOptions extends AjaxOptions = AjaxOptions,
    TOptions extends TServiceOptions & BeetleQueryOptions = TServiceOptions & BeetleQueryOptions>
    extends Context<TServiceOptions, TOptions>
    implements IRequestProvider<BeetleQueryOptions> {

    constructor(options?: ContextOptions<TServiceOptions>);
    constructor(baseAddress?: string, options?: ContextOptions<TServiceOptions>);
    constructor(baseAddressOrOptions: string | ContextOptions<TServiceOptions> = {}, options: ContextOptions<TServiceOptions> = {}) {
        super(arrangeArgs(baseAddressOrOptions, options));
    }

    private readonly _sets: Map<string, EntitySet<any, TOptions>> = new Map<string, EntitySet<any, TOptions>>();

    set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string, path: string): EntitySet<T, TOptions> {
        const t = getTypeName(type);

        if (this._sets.has(t))
            return this._sets.get(t);

        const set = new EntitySet<T, TOptions>(this.store<T>(t), path || t);
        this._sets[t] = set;
        return set;
    }
}

function arrangeArgs<TServiceOptions>(aOrO: string | ContextOptions<TServiceOptions> = {}, o?: ContextOptions<TServiceOptions>) {
    if (typeof aOrO === "string") {
        if (o) {
            if (o.requestProvider) return o;
        } else {
            o = {};
        }

        o.requestProvider = new LinqService(aOrO)
        return o;
    }
    
    return aOrO ? aOrO : o;
}
