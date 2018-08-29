import { QueryPart, Query, PartArgument } from "jinqu";
import { MergeStrategy } from "../tracking/merge-strategy";
import { BeetleQueryOptions } from "./beetle-query-options";
import { WebFunc } from "../types";

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this.create(QueryPart.create(WebFunc.options, [PartArgument.literal(options)]));
    }

    asNoTracking() {
        return this.create(QueryPart.create(WebFunc.options, [PartArgument.literal({ merge: MergeStrategy.NoTracking })]));
    }
}
