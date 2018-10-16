import { createRefs } from 'circular-ref-fix';
import { AjaxOptions, IAjaxProvider, Ctor, QueryParameter, IRequestProvider } from "jinqu";
import { getTypeName } from './helper';
import { MetadataManager, NavigationProperty } from "./metadata";
import { IEntity, EntityBase, BeetleQueryOptions, SaveResult, IEntitySet } from "./types";
import { MergeStrategy, EntityEntry, EntityStore, EntityState } from "./tracking";
import { FetchAjaxProvider, mergeQueryOptions } from 'linquest';

export interface ContextOptions {
    baseAddress?: string;
    metadata?: MetadataManager;
    ajaxProvider?: IAjaxProvider;
}

export abstract class Context<TOptions extends BeetleQueryOptions = BeetleQueryOptions> implements IRequestProvider<BeetleQueryOptions> {

    constructor(options: ContextOptions = {}) {
        this.baseAddress = options.baseAddress;
        this.metadata = options.metadata;
        this.ajaxProvider = options.ajaxProvider || new FetchAjaxProvider();
        this._stores = new Map<string, EntityStore<any>>();

        this.configure()
    }

    protected readonly defaultOptions: BeetleQueryOptions = {};
    protected readonly baseAddress: string;
    protected readonly metadata: MetadataManager;
    protected readonly ajaxProvider: IAjaxProvider;
    private readonly _stores: Map<string, EntityStore<any>>;

    protected configure() {
    }

    add(entity: IEntity) {
        this.mergeEntities(entity, EntityState.Added);
    }

    attach(entity: IEntity) {
        this.mergeEntities(entity);
    }

    request<TResult>(params: QueryParameter[], options: TOptions[]): PromiseLike<TResult> {
        const o = this.mergeOptions(params, options);
        return this.ajaxProvider.ajax<TResult>(o)
            .then(d => {
                if (o.merge !== MergeStrategy.NoTracking) {
                    this.mergeEntities(<any>d, EntityState.Unchanged, o.merge);
                }

                return d;
            });
    }

    detectChanges() {
        const changes: EntityEntry[] = [];

        for (let s of this._stores.values()) {
            for (let e of s.allEntries) {
                if (e.isChanged()) {
                    changes.push(e);
                }
            }
        }

        return changes;
    }

    saveChanges(options?: BeetleQueryOptions): PromiseLike<SaveResult> {
        const changes = this.detectChanges();
        return this.saveEntries(changes, options)
            .then(sr => {
                changes.forEach((c, i) => {
                    const uv = sr && sr.updatedEntities && sr.updatedEntities.find(v => v.index === i);
                    c.accept(uv && uv.values);
                });

                return sr;
            });
    }

    saveEntries(entries: EntityEntry[], options?: BeetleQueryOptions): PromiseLike<SaveResult> {
        if (!entries || !entries.length)
            return Promise.resolve<SaveResult>({ affectedCount: 0 });

        const pkg = entries.map(e => Object.assign(e.getTrackingInfo(), e.entity));
        const safePkg = createRefs(pkg);
        const o: AjaxOptions = {
            data: JSON.stringify(safePkg),
            method: 'POST',
            url: 'SaveChanges'
        };

        return this.ajaxProvider.ajax(this.mergeOptions([], [options, o]));
    }

    protected store<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): EntityStore<T> {
        const t = getTypeName(type);

        if (!this._stores.has(t)) {
            const store = new EntityStore<T>(this, this.metadata && this.metadata.getType(t));
            this._stores.set(t, store);
            return store;
        }

        return this._stores.get(t);
    }

    private mergeInternal(entities: IEntity[] | IEntity, state: EntityState, merge: MergeStrategy) {
        if (!entities) return;

        if (!(entities instanceof Array)) {
            entities = [entities];
        }

        for (const e of entities) {
            if (!e.$type) continue;

            const store = this.store(e.$type);
            store.merge(e, state, merge);

            for (let k of Object.keys(e)) {
                const v = e[k];
                if (!(v instanceof Date) && v !== Object(v) && k[0] !== '$') {
                    this.mergeInternal(v, state, merge);
                }
            }
        }
    }
    
    protected mergeEntities(entities: IEntity[] | IEntity, state = EntityState.Unchanged, merge = MergeStrategy.Throw) {
        this.mergeInternal(entities, state, merge);
        this.fixNavigations();
    }

    protected fixNavigations() {
        this._stores.forEach(s => {
            for (let e of s.allEntries) {
                this.fixEntryNavigations(e);
            }
        });
    }

    protected fixEntryNavigations(entry: EntityEntry) {
        if (entry.type == null) return;

        entry.type.navigationProperties.forEach(n => this.fixNavigation(entry, n));
    }

    protected fixNavigation(entry: EntityEntry, navigation: NavigationProperty) {
    }

    protected mergeOptions(params: QueryParameter[], options: BeetleQueryOptions[]) {
        const d = Object.assign({}, this.defaultOptions);
        const o = (options || []).reduce(mergeBeetleQueryOptions, d);
        if (this.baseAddress) {
            if (this.baseAddress[this.baseAddress.length - 1] !== '/' && o.url && o.url[0] !== '/') {
                o.url = '/' + o.url;
            }
            o.url = this.baseAddress + (o.url || '');
        }
        o.params = (params || []).concat(o.params || []);

        return o;
    }

    abstract set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string, path: string): IEntitySet<T>;
}

export function mergeBeetleQueryOptions(o1: BeetleQueryOptions, o2: BeetleQueryOptions) {
    const o: BeetleQueryOptions = mergeQueryOptions(o1, o2);
    o.merge = o2.merge || o1.merge;
    return o;
}