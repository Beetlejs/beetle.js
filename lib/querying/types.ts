export type QueryParameter = { key: string; value: string };

export const WebFunc = {
    options: 'options'
};

export interface WebRequestOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    dataType?: string;
    contentType?: string;
    timeout?: number;
    headers?: { [key: string]: string };
}

export interface IRequestProvider<TOptions extends WebRequestOptions> {
    call<TResult>(prms: QueryParameter[], options: TOptions[]): TResult;
}

export interface BeetleQueryOptions extends WebRequestOptions {
    noTracking?: boolean;
}
