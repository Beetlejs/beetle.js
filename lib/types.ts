import { MergeStrategy } from "./tracking/merge-strategy";

export interface IEntity {
    $type: string;
}

export class EntityBase implements IEntity {
    $type: string;
    static $type: string;
}

export type QueryParameter = { key: string; value: string };

export const WebFunc = {
    options: 'options'
};

export interface WebRequestOptions {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: QueryParameter[];
    data?: any;
    dataType?: string;
    contentType?: string;
    timeout?: number;
    headers?: { [key: string]: string };
}

export interface BeetleQueryOptions extends WebRequestOptions {
    merge?: MergeStrategy;
}

export interface IRequestProvider<TOptions extends WebRequestOptions> {
    call<TResult>(prms: QueryParameter[], options: TOptions[]): PromiseLike<TResult>;
}

export interface IAjaxProvider {
    doAjax<TResult>(options: WebRequestOptions): PromiseLike<TResult>;
}

export interface SaveResult {
    affectedCount?: number;
    updatedEntities?: Array<{index: number, values: any}>;
}
