import { IEntity, SaveResult, IAjaxProvider } from "./types";
import { EntityEntry, EntityStore, EntityState, TrackedEntity } from "./tracking";
import { MetadataManager, NavigationProperty } from "./metadata";
import { MergeStrategy } from "./tracking/merge-strategy";

export abstract class Context {

    constructor(protected readonly metadata: MetadataManager) {
    }

    private _stores: Map<string, EntityStore<any>>;

    protected store<T extends IEntity>(type: string): EntityStore<T> {
        if (this._stores.has(type))
            return this._stores[type] = new EntityStore<T>(this.metadata.getType(type));
        return this._stores[type];
    }

    protected mergeEntities(entities: IEntity[] | IEntity, state = EntityState.Unchanged, merge = MergeStrategy.Throw) {

        function mg(es: IEntity[] | IEntity, s: EntityState, m: MergeStrategy) {
            if (!es) return;

            if (!(es instanceof Array)) {
                es = [es];
            }

            for (const e of es) {
                if (e.$type) {
                    const store = this.store(e.$type);
                    store.merge(e, state, merge);
                }

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

    add(entity: IEntity) {
        this.mergeEntities(entity, EntityState.Added);
    }

    attach(entity: IEntity) {
        this.mergeEntities(entity);
    }

    saveChanges(): PromiseLike<SaveResult> {
        const changes = [];

        this._stores.forEach(s => {
            s.allEntries.forEach(e => {
                if (e.isChanged()) {
                    changes.push(e);
                }
            });
        });

        return this.saveEntries(changes);
    }

    abstract saveEntries(entries: EntityEntry[]): PromiseLike<SaveResult>;
}
