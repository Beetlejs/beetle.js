import { IQuery } from "jinqu";
import { IEntity, IRequestProvider } from "../types";
import { BeetleQuery } from "./beetle-query";
import { BeetleQueryOptions } from "./beetle-query-options";
import { BeetleQueryProvider } from "./beetle-query-provider";

export class EntitySet<T extends IEntity> extends BeetleQuery<T> {

    constructor(public local: IQuery<T>, requestProvider: IRequestProvider<BeetleQueryOptions>) {
        super(new BeetleQueryProvider(requestProvider));
    }
}
