export interface IEntity {
    $type: string;
}

export interface IWebRequestOptions {
}

export type RequestProvider<TOptions extends IWebRequestOptions> =
    (prms: [{ key: string; value: string }], options: TOptions) => Promise<IteratorResult<any>>;
