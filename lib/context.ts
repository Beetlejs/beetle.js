import { createRefs } from 'circular-ref-fix';
import { AjaxOptions, IAjaxProvider, Ctor, QueryParameter, IRequestProvider } from "jinqu";
import { getTypeName } from './helper';
import { MetadataManager, NavigationProperty } from "./metadata";
import { IEntity, EntityBase, BeetleQueryOptions, SaveResult, IEntitySet } from "./types";
import { MergeStrategy, EntityEntry, EntityStore, EntityState } from "./tracking";
import { FetchAjaxProvider, mergeQueryOptions } from 'linquest';

export abstract class Context<TOptions extends BeetleQueryOptions = BeetleQueryOptions> implements IRequestProvider<TOptions> {

    constructor(protected readonly metadata?: MetadataManager, protected readonly ajaxProvider: IAjaxProvider = new FetchAjaxProvider()) {
        this.configure()
    }

    private _stores: Map<string, EntityStore<any>>;

    configure() {
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
                e.detectChanges();
                
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
        
        if (!this._stores.has(t))
            return this._stores[t] = new EntityStore<T>(this, this.metadata.getType(t));
        return this._stores[t];
    }

    protected mergeEntities(entities: IEntity[] | IEntity, state = EntityState.Unchanged, merge = MergeStrategy.Throw) {

        function mg(es: IEntity[] | IEntity, s: EntityState, m: MergeStrategy) {
            if (!es) return;

            if (!(es instanceof Array)) {
                es = [es];
            }

            for (const e of es) {
                if (!e.$type) continue;
                    
                const store = this.store(e.$type);
                store.merge(e, state, merge);

                for (let k of Object.keys(e)) {
                    const v = e[k];
                    if (!(v instanceof Date) && v !== Object(v)) {
                        mg(v, s, m);
                    }
                }
            }
        }

        mg(entities, state, merge);
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
        let opt = <BeetleQueryOptions>{};

        (options || []).forEach(o => {
            opt = mergeQueryOptions(opt, o);
            opt.merge = o.merge || opt.merge;
        });
        opt.params = (opt.params || []).concat(params || []);

        return opt;
    }

    abstract set<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): IEntitySet<T>;
}
