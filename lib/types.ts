export interface IEntity {
    $type: string;
}

export type QueryParameter = { key: string; value: string };

export const WebFunc = {
    options: 'options'
};

export interface IRequestProvider<TOptions extends WebRequestOptions> {
    call<TResult>(prms: QueryParameter[], options: TOptions[]): PromiseLike<TResult>;
}

export interface WebRequestOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    dataType?: string;
    contentType?: string;
    timeout?: number;
    headers?: { [key: string]: string };
}
