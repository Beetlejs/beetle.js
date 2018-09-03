import createRefs = require('circular-ref-fix');
import { Ctor } from 'jinqu';
import { Context } from "../context";
import { IEntity, QueryParameter, IAjaxProvider, BeetleQueryOptions, SaveResult, EntityBase } from "../types";
import { MetadataManager } from "../metadata";
import { EntitySet } from "./entity-set";
import { MergeStrategy } from "../tracking/merge-strategy";
import { EntityEntry, EntityState } from "../tracking";
import { getTypeName } from '../helper';

export class BeetleContext extends Context {

    constructor(metadata: MetadataManager, private readonly ajaxProvider?: IAjaxProvider) {
        super(metadata);
    }

    private _sets: Map<string, EntitySet<any>>;

    set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): EntitySet<T> {
        const t = getTypeName(type);

        if (this._sets.has(t))
            return this._sets[t];

        return this._sets[t] = new EntitySet<T>(this.store<T>(t), { call: this.call });
    }

    private call<TResult>(params: QueryParameter[], options: BeetleQueryOptions[]): PromiseLike<TResult> {
        const o = this.mergeOptions(params, options);
        return this.ajaxProvider.doAjax<TResult>(o)
            .then(d => {
                if (o.merge !== MergeStrategy.NoTracking) {
                    this.mergeEntities(<any>d, EntityState.Unchanged, o.merge);
                }

                return d;
            });
    }

    protected mergeOptions(params: QueryParameter[], options: BeetleQueryOptions[]): BeetleQueryOptions {
        params = params || [];
        let opt: BeetleQueryOptions = {};
        let body = {};

        if (options) {
            options.forEach(o => {
                if (o.params) {
                    params = params.concat(o.params);
                }

                if (o.body) {
                    body = Object.assign(body, o.body);
                }

                opt = Object.assign(opt, o);
            });
        }

        opt.params = params;
        opt.body = body;

        return opt;
    }

    saveEntries(entries: EntityEntry[]): PromiseLike<SaveResult> {
        if (!entries || !entries.length)
            return Promise.resolve<SaveResult>({ affectedCount: 0 });

        const pkg = entries.map(e => Object.assign(e.getTrackingInfo(), e.entity));
        const safePkg = createRefs(pkg);

        return this.ajaxProvider.doAjax({
            body: safePkg,
            contentType: 'application/json',
            dataType: 'json',
            method: 'POST',
            url: 'SaveChanges'
        });
    }
}
