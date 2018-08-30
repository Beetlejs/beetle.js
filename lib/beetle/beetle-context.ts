import { Context } from "../context";
import { IEntity, QueryParameter, WebRequestOptions, IAjaxProvider } from "../types";
import { BeetleQueryOptions } from "./beetle-query-options";
import { IRequestProvider } from "../types";
import { MetadataManager } from "../metadata";
import { EntitySet } from "./entity-set";
import { MergeStrategy } from "../tracking/merge-strategy";

export class BeetleContext extends Context {

    constructor(metadata: MetadataManager, private readonly ajaxProvider?: IAjaxProvider) {
        super(metadata);
    }

    private _sets: Map<string, EntitySet<any>>;

    set<T extends IEntity>(type: string): EntitySet<T> {
        if (this._sets.has(type))
            return this._sets[type] = new EntitySet<T>(this.store<T>(type).local, { call: this.call });

        return this._sets[type];
    }

    private call<TResult>(params: QueryParameter[], options: BeetleQueryOptions[]): PromiseLike<TResult> {
        const o = this.mergeOptions(params, options);
        return this.ajaxProvider.doAjax<TResult>(o)
            .then(d => {
                if (o.merge !== MergeStrategy.NoTracking) {
                    this.mergeEntities(<any>d);
                }

                return d;
            });
    }

    private mergeOptions(params: QueryParameter[], options: BeetleQueryOptions[]): BeetleQueryOptions {
        let opt: BeetleQueryOptions = {};
        let body = {};

        options.forEach(o => {
            if (o.params) {
                params = params.concat(o.params);
            }

            if (o.body) {
                body = Object.assign(body, o.body);
            }

            opt = Object.assign(opt, o);
        });
        
        opt.params = params;
        opt.body = body;

        return opt;
    }
}
