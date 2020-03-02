import { createRefs } from 'circular-ref-fix';
import { AjaxOptions, IAjaxProvider, Ctor, QueryParameter, IRequestProvider, AjaxResponse, Result } from "jinqu";
import { getTypeName } from './helper';
import { MetadataManager, NavigationProperty } from "./metadata";
import { IEntity, EntityBase, BeetleQueryOptions, SaveResult, IEntitySet } from "./shared";
import { MergeStrategy, EntityEntry, EntityStore, EntityState } from "./tracking";
import { mergeQueryOptions, LinqService } from 'linquest';

export interface ContextOptions<TServiceOptions extends AjaxOptions> {
    metadata?: MetadataManager;
    requestProvider?: IRequestProvider<TServiceOptions>;
}

export abstract class Context<
    TServiceOptions extends AjaxOptions = AjaxOptions,
    TOptions extends TServiceOptions & BeetleQueryOptions = TServiceOptions & BeetleQueryOptions>
    implements IRequestProvider<BeetleQueryOptions> {

    constructor(options: ContextOptions<TServiceOptions> = {}) {
        this.metadata = options.metadata;
        this.requestProvider = options.requestProvider || <any>new LinqService();
        this._stores = new Map<string, EntityStore<any, TOptions>>();

        this.configure()
    }

    protected readonly defaultOptions: BeetleQueryOptions = {};
    protected readonly metadata: MetadataManager;
    protected readonly requestProvider: IRequestProvider<TOptions>;
    private readonly _stores: Map<string, EntityStore<any, TOptions>>;

    protected configure() {
    }

    add(entity: IEntity) {
        this.mergeEntities(entity, EntityState.Added);
    }

    attach(entity: IEntity) {
        this.mergeEntities(entity);
    }

    request<TResult, TExtra = {}>(params: QueryParameter[], options: TOptions[]) {
        const o = <TOptions>this.mergeOptions(params, options);
        return this.requestProvider.request<TResult, TExtra>(params, [o])
            .then(d => {
                const dr = d as any;
                const result = (dr && dr.value) || dr;

                if (o.merge !== MergeStrategy.NoTracking) {
                    this.mergeEntities(<any>result, EntityState.Unchanged, o.merge);
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

    saveChanges<TExtra = {}>(options?: TOptions) {
        const changes = this.detectChanges();
        return this.saveEntries<TExtra>(changes, options)
            .then(d => {
                const dr = d as any;
                const sr: SaveResult = (dr && dr.value) || dr;
                changes.forEach((c, i) => {
                    const uv = sr && sr.updatedEntities && sr.updatedEntities.find(v => v.index === i);
                    if (uv) {
                        c.accept(uv && uv.values);
                    }
                });

                return sr;
            });
    }

    saveEntries<TExtra = {}>(entries: EntityEntry[], options?: TOptions) {
        if (!entries || !entries.length)
            return Promise.resolve<Result<SaveResult, TExtra>>(<any>{ affectedCount: 0, value: { affectedCount: 0 } });

        const pkg = entries.map(e => Object.assign(e.getTrackingInfo(), e.entity));
        const safePkg = createRefs(pkg);
        const o: AjaxOptions = {
            data: JSON.stringify(safePkg),
            method: 'POST',
            url: 'SaveChanges'
        };

        const opt = [this.mergeOptions([], [options, o])] as any;
        return this.requestProvider.request<SaveResult, TExtra>([], opt);
    }

    protected store<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): EntityStore<T, TOptions> {
        const t = getTypeName(type);

        if (!this._stores.has(t)) {
            const store = new EntityStore<T, TOptions>(this, this.metadata && this.metadata.getType(t));
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
        this.fixRelations();
    }

    protected fixRelations() {
        this._stores.forEach(s => {
            for (let e of s.allEntries) {
                this.fixEntryRelations(e);
            }
        });
    }

    protected fixEntryRelations(entry: EntityEntry) {
        if (entry.type == null) return;

        entry.type.navigationProperties.forEach(n => this.fixNavigation(entry, n));
    }

    protected fixNavigation(entry: EntityEntry, navigation: NavigationProperty) {
    }

    protected mergeOptions(params: QueryParameter[], options: BeetleQueryOptions[]) {
        const d = Object.assign({}, this.defaultOptions);
        const o = (options || []).reduce(mergeBeetleQueryOptions, d);
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