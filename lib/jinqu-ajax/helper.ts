import { AjaxOptions } from "./types";

export function mergeOptions(o1: AjaxOptions, o2: AjaxOptions): AjaxOptions {
    if (o1 == null) return o2;
    if (o2 == null) return o1;
    
    return {
        data: o1.data ? Object.assign({}, o1.data, o2.data) : o2.data,
        headers: Object.assign({}, o1.headers, o2.headers),
        method: o2.method || o1.method,
        params: (o1.params || []).concat(o2.params || []),
        timeout: o2.timeout || o1.timeout,
        url: o2.url || o1.url
    };
}
