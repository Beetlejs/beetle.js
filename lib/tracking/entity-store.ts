export class EntityStore<T extends IEntity> {
    
    constructor(private readonly manager: EntityManager, private readonly type: EntityType) {
    }
    
    private readonly entries = new Map<string, EntityEntry<T>>();
    private readonly allEntries = new Set<EntityEntry<T>>();
    private readonly entities: Array<T> = [];

    getByKey(key: string) {
        return this.entries.get(key);
    }

    add(entity: T) {
        const entry = new EntityEntry(this, entity, this.type, EntityState.Added);

        const key = entry.key;
        if (key) {
            if (this.entries.has(key))
                throw new Error(`Store already has an entity with key ${key}`);

            this.entries[key] = entry;
        }
        this.allEntries.add(entry);
        this.entities.push(entity);
    }
}
