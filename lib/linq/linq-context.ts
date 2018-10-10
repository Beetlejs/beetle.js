import createRefs = require('circular-ref-fix');
import { Ctor, IRequestProvider, IAjaxProvider, QueryParameter } from 'jinqu';
import { FetchAjaxProvider, mergeLinqOptions } from 'linquest';
import { Context } from "../context";
import { IEntity, SaveResult, EntityBase } from '../types';
import { MetadataManager } from '../metadata';
import { EntityEntry, EntityState, MergeStrategy } from '../tracking';
import { getTypeName } from '../helper';
import { EntitySet, BeetleLinqOptions } from "./entity-set";

export class BeetleLinqContext extends Context implements IRequestProvider<BeetleLinqOptions, Response> {

    constructor(metadata?: MetadataManager, protected readonly ajaxProvider: IAjaxProvider = new FetchAjaxProvider()) {
        super(metadata);
    }

    private _sets: Map<string, EntitySet<any>>;

    set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): EntitySet<T> {
        const t = getTypeName(type);

        if (this._sets.has(t))
            return this._sets[t];

        return this._sets[t] = new EntitySet<T>(this.store<T>(t), this);
    }

    request<TResult>(params: QueryParameter[], options: BeetleLinqOptions[]): PromiseLike<TResult> {
        const o = this.mergeOptions(params, options);
        return this.ajaxProvider.ajax<TResult>(o)
            .then(d => {
                if (o.merge !== MergeStrategy.NoTracking) {
                    this.mergeEntities(<any>d, EntityState.Unchanged, o.merge);
                }

                return d;
            });
    }

    protected mergeOptions(params: QueryParameter[], options: BeetleLinqOptions[]) {
        let opt = <BeetleLinqOptions>{};

        (options || []).forEach(o => {
            opt = mergeLinqOptions(opt, o);
            opt.merge = o.merge || opt.merge;
        });
        opt.params = (opt.params || []).concat(params || []);

        return opt;
    }

    saveEntries(entries: EntityEntry[]): PromiseLike<SaveResult> {
        if (!entries || !entries.length)
            return Promise.resolve<SaveResult>({ affectedCount: 0 });

        const pkg = entries.map(e => Object.assign(e.getTrackingInfo(), e.entity));
        const safePkg = createRefs(pkg);

        return this.ajaxProvider.ajax({
            data: JSON.stringify(safePkg),
            method: 'POST',
            url: 'SaveChanges'
        });
    }
}
