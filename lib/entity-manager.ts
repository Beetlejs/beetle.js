import { IEntity } from "./types";
import { EntityEntry } from "./tracking";
import { IRequestProvider, IWebRequestOptions, QueryParameters } from './querying';

export abstract class EntityManagerBase<TOptions extends IWebRequestOptions> {

    constructor(private readonly requestProvider: IRequestProvider<TOptions>) {
    }

    mergeEntities(entities: IteratorResult<IEntity> | IEntity) {
    }

    saveChanges() {
    }

    saveEntries(entries: EntityEntry[]) {
    }

    private doRequest(prms: QueryParameters, options: TOptions) {
        this.requestProvider.call(prms, options)
            .then(
                d => this.mergeEntities(<any>d),
                
            );
    }
}
