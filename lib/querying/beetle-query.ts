import { QueryPart, Query, PartArgument, Predicate, Func1, Func2 } from "jinqu";
import { BeetleQueryOptions, WebFunc } from ".";
import { MergeStrategy } from "../tracking/merge-strategy";

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this.create(QueryPart.create(WebFunc.options, [PartArgument.literal(options)]));
    }

    asNoTracking() {
        return this.create(QueryPart.create(WebFunc.options, [PartArgument.literal({ merge: MergeStrategy.NoTracking })]));
    }
}
