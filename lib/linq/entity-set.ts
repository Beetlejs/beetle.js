import { IQuery } from "jinqu";
import { IEntity, IRequestProvider, BeetleQueryOptions } from "../types";
import { BeetleQuery } from "../beetle/beetle-query";
import { BeetleQueryProvider } from "../beetle/beetle-query-provider";

export class EntitySet<T extends IEntity> extends BeetleQuery<T> {

    constructor(public local: IQuery<T>, requestProvider: IRequestProvider<BeetleQueryOptions>) {
        super(new BeetleQueryProvider(requestProvider));
    }
}
