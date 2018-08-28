import { QueryPart, Query, PartArgument, Predicate, Func1, Func2 } from "jinqu";
import { BeetleQueryOptions, WebFunc } from ".";

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this.create(QueryPart.create(WebFunc.options, [PartArgument.literal(options)]));
    }

    asNoTracking() {
        return this.create(QueryPart.create(WebFunc.options, [PartArgument.literal({ noTracking: true })]));
    }

    first(predicate?: Predicate<T>, ...scopes): T {
        throw new Error('Synchronous execution is not supported');
    }

    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.first(predicate, scopes)]);
    }

    firstOrDefault(predicate?: Predicate<T>, ...scopes): T {
        throw new Error('Synchronous execution is not supported');
    }

    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.firstOrDefault(predicate, scopes)]);
    }

    last(predicate?: Predicate<T>, ...scopes): T {
        throw new Error('Synchronous execution is not supported');
    }

    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.last(predicate, scopes)]);
    }

    lastOrDefault(predicate?: Predicate<T>, ...scopes): T {
        throw new Error('Synchronous execution is not supported');
    }

    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.lastOrDefault(predicate, scopes)]);
    }

    single(predicate?: Predicate<T>, ...scopes): T {
        throw new Error('Synchronous execution is not supported');
    }

    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.single(predicate, scopes)]);
    }

    singleOrDefault(predicate?: Predicate<T>, ...scopes): T {
        throw new Error('Synchronous execution is not supported');
    }

    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.singleOrDefault(predicate, scopes)]);
    }

    elementAt(index: number): T {
        throw new Error('Synchronous execution is not supported');
    }

    elementAtAsync(index: number): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.elementAt(index)]);
    }

    elementAtOrDefault(index: number): T {
        throw new Error('Synchronous execution is not supported');
    }

    elementAtOrDefaultAsync(index: number): PromiseLike<T> {
        return this.provider.execute<T, PromiseLike<T>>([...this.parts, QueryPart.elementAtOrDefault(index)]);
    }

    contains(item: T): boolean {
        throw new Error('Synchronous execution is not supported');
    }

    containsAsync(item: T): PromiseLike<boolean> {
        return this.provider.execute<T, PromiseLike<boolean>>([...this.parts, QueryPart.contains(item)]);
    }

    sequenceEqual(other: Array<T> | string, ...scopes): boolean {
        throw new Error('Synchronous execution is not supported');
    }

    sequenceEqualAsync(other: Array<T> | string, ...scopes): PromiseLike<boolean> {
        return this.provider.execute<T, PromiseLike<boolean>>([...this.parts, QueryPart.sequenceEqual(other, scopes)]);
    }

    any(predicate?: Predicate<T>, ...scopes): boolean {
        throw new Error('Synchronous execution is not supported');
    }

    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<boolean> {
        return this.provider.execute<T, PromiseLike<boolean>>([...this.parts, QueryPart.any(predicate, scopes)]);
    }

    all(predicate: Predicate<T>, ...scopes): boolean {
        throw new Error('Synchronous execution is not supported');
    }

    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<boolean> {
        return this.provider.execute<T, PromiseLike<boolean>>([...this.parts, QueryPart.all(predicate, scopes)]);
    }

    count(predicate?: Predicate<T>, ...scopes): number {
        throw new Error('Synchronous execution is not supported');
    }

    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<boolean> {
        return this.provider.execute<T, PromiseLike<boolean>>([...this.parts, QueryPart.count(predicate, scopes)]);
    }

    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult {
        throw new Error('Synchronous execution is not supported');
    }

    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult> {
        return this.provider.execute<T, PromiseLike<TResult>>([...this.parts, QueryPart.min(selector, scopes)]);
    }

    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): TResult {
        throw new Error('Synchronous execution is not supported');
    }

    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<TResult> {
        return this.provider.execute<T, PromiseLike<TResult>>([...this.parts, QueryPart.max(selector, scopes)]);
    }

    sum(selector?: Func1<T, number>, ...scopes): number {
        throw new Error('Synchronous execution is not supported');
    }

    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number> {
        return this.provider.execute<T, PromiseLike<number>>([...this.parts, QueryPart.sum(selector, scopes)]);
    }

    average(selector?: Func1<T, number>, ...scopes): number {
        throw new Error('Synchronous execution is not supported');
    }

    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<number> {
        return this.provider.execute<T, PromiseLike<number>>([...this.parts, QueryPart.average(selector, scopes)]);
    }

    aggregate<TAccumulate = any, TResult = TAccumulate>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate,
                                                        selector?: Func1<TAccumulate, TResult>, ...scopes): TResult {
        throw new Error('Synchronous execution is not supported');
    }

    aggregateAsync<TAccumulate = any, TResult = TAccumulate>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate,
                                                             selector?: Func1<TAccumulate, TResult>, ...scopes): PromiseLike<TResult> {
        return this.provider.execute<T, PromiseLike<TResult>>([...this.parts, QueryPart.aggregate(func, seed, selector, scopes)]);
    }

    toArray(): T[] {
        throw new Error('Synchronous execution is not supported');
    }

    toArrayAsync() {
        return this.provider.execute<T, PromiseLike<T[]>>(this.parts);
    }

    then<TError = never>(onfulfilled: (value: T[]) => T[] | PromiseLike<T[]>, onrejected?: ((reason: any) => TError | PromiseLike<TError>)) {
        return this.toArrayAsync().then(onfulfilled, onrejected);
    }
}
