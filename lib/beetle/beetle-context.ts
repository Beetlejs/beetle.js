import { Context } from "../context";
import { IEntity } from "../types";
import { BeetleQueryOptions } from "./beetle-query-options";
import { IRequestProvider } from "../types";
import { MetadataManager } from "../metadata";
import { EntitySet } from "./entity-set";

export class BeetleContext extends Context {

    constructor(metadata: MetadataManager, protected readonly requestProvider?: IRequestProvider<BeetleQueryOptions>) {
        super(metadata);
    }

    private _sets: Map<string, EntitySet<any>>;

    set<T extends IEntity>(type: string): EntitySet<T> {
        if (this._sets.has(type))
            return this._sets[type] = new EntitySet<T>(this.store<T>(type).local, this.requestProvider);

        return this._sets[type];
    }
}
