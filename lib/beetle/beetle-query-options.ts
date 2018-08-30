import { WebRequestOptions } from "../types";
import { MergeStrategy } from "../tracking/merge-strategy";

export interface BeetleQueryOptions extends WebRequestOptions {
    merge?: MergeStrategy;
}
