import { QueryPart, Query, PartArgument } from "jinqu";
import { AjaxFuncs, AjaxOptions } from './types';

export class AjaxQuery<T, TOptions extends AjaxOptions = AjaxOptions> extends Query<T> {

    withOptions(options: TOptions) {
        return this.create(QueryPart.create(AjaxFuncs.options, [PartArgument.literal(options)]));
    }
}
