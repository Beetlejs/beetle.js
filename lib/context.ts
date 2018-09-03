import { Ctor } from "jinqu";
import { IEntity, SaveResult, EntityBase } from "./types";
import { EntityEntry, EntityStore, EntityState } from "./tracking";
import { MetadataManager, NavigationProperty } from "./metadata";
import { MergeStrategy } from "./tracking/merge-strategy";
import { getTypeName } from './helper';

export abstract class Context {

    constructor(protected readonly metadata?: MetadataManager) {
        this.configure()
    }

    private _stores: Map<string, EntityStore<any>>;

    protected store<T extends IEntity>(type: (typeof EntityBase & Ctor<T>) | string): EntityStore<T> {
        const t = getTypeName(type);
        
        if (!this._stores.has(t))
            return this._stores[t] = new EntityStore<T>(this.metadata.getType(t));
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

    configure() {
    }

    add(entity: IEntity) {
        this.mergeEntities(entity, EntityState.Added);
    }

    attach(entity: IEntity) {
        this.mergeEntities(entity);
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

    saveChanges(): PromiseLike<SaveResult> {
        return this.saveEntries(this.detectChanges());
    }

    abstract saveEntries(entries: EntityEntry[]): PromiseLike<SaveResult>;
}
