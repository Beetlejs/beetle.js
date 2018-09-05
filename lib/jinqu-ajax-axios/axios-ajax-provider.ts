import { IRequestProvider, IAjaxProvider, AjaxOptions, QueryParameter } from "../jinqu-ajax/types";
import { mergeOptions } from "../jinqu-ajax/helper";
import axios from 'axios';

export const axiosAjaxProvider: IRequestProvider<AjaxOptions> & IAjaxProvider = {

    request<TResult>(prms: QueryParameter[], options: AjaxOptions[]): PromiseLike<TResult> {
        const opt = (options || []).reduce(mergeOptions, {});
        opt.params.concat(prms);

        return this.ajax(opt);
    },

    ajax<TResult>(o: AjaxOptions): PromiseLike<TResult> {
        return <any>axios.request<TResult>(o);
    }
}
