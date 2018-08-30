export interface IEntity {
    $type: string;
}

export type QueryParameter = { key: string; value: string };

export const WebFunc = {
    options: 'options'
};

export interface WebRequestOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: QueryParameter[];
    body?: any;
    dataType?: string;
    contentType?: string;
    timeout?: number;
    headers?: { [key: string]: string };
}

export interface IQueryProvider<TOptions extends WebRequestOptions> {
    call<TResult>(prms: QueryParameter[], options: TOptions[]): PromiseLike<TResult>;
}

export interface IRequestProvider {
    call<TResult>(options: WebRequestOptions): PromiseLike<TResult>;
}

export interface IAjaxProvider {
    doAjax<TResult>(options: WebRequestOptions): PromiseLike<TResult>;
}