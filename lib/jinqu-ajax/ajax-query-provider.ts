import { IQueryProvider, IQueryPart } from "jinqu";
import { QueryParameter, AjaxFuncs, AjaxOptions, IRequestProvider } from "./types";
import { AjaxQuery } from './ajax-query';
import { axiosAjaxProvider } from "../jinqu-ajax-axios/axios-ajax-provider";

export abstract class AjaxQueryProvider<TOptions extends AjaxOptions> implements IQueryProvider {

    constructor(protected requestProvider: IRequestProvider<TOptions>) {
        requestProvider = requestProvider || axiosAjaxProvider
    }

    createQuery<T>(parts?: IQueryPart[]) {
        return new AjaxQuery<T>(this, parts);
    }

    execute<T = any, TResult = PromiseLike<T[]>>(): TResult {
        throw new Error('Synchronous execution is not supported');
    }

    executeAsync<T = any, TResult = T[]>(parts: IQueryPart[]): PromiseLike<TResult> {
        const prms: QueryParameter[] = [];
        let os: TOptions[] = [];

        for (let p of parts) {
            if (p.type === AjaxFuncs.options) {
                os.push(p.args[0].literal);
            } else {
                prms.push(this.handlePart(p));
            }
        }

        return this.requestProvider.request<TResult>(prms, os);
    }

    abstract handlePart(part: IQueryPart): QueryParameter;
}
