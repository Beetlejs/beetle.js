export type QueryParameter = { key: string; value: string };

export const AjaxFuncs = {
    options: 'options'
};

export interface AjaxOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: QueryParameter[];
    data?: any;
    timeout?: number;
    headers?: { [key: string]: string };
}

export interface IRequestProvider<TOptions extends AjaxOptions> {
    request<TResult>(prms: QueryParameter[], options: TOptions[]): PromiseLike<TResult>;
}

export interface IAjaxProvider {
    ajax<TResult>(options: AjaxOptions): PromiseLike<TResult>;
}
