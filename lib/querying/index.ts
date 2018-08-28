import { IQueryProvider, IQueryPart, Query, QueryPart, PartArgument, QueryFunc, Predicate, Func1, Func2 } from 'jinqu';
import {
    ExpressionType, Expression,
    LiteralExpression, VariableExpression, UnaryExpression,
    GroupExpression, AssignExpression, ObjectExpression, ArrayExpression,
    BinaryExpression, MemberExpression, IndexerExpression, FuncExpression,
    CallExpression, TernaryExpression
} from 'jokenizer';

export const WebFunc = {
    options: 'options'
};

export type QueryParameter = { key: string; value: string };

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

export class WebQueryProvider<TOptions extends WebRequestOptions> implements IQueryProvider {

    constructor(protected requestProvider: IRequestProvider<TOptions>) {
    }

    createQuery<T>(parts?: IQueryPart[]) {
        return new Query<T>(this, parts);
    }

    execute<T = any, TResult = PromiseLike<T[]>>(parts: IQueryPart[]): TResult {
        const prms: QueryParameter[] = [];
        let os: TOptions[] = [];

        for (let p of parts) {
            if (p.type === WebFunc.options) {
                os.push(p.args[0].literal);
            } else {
                prms.push(this.handlePart(p));
            }
        }

        return this.requestProvider.call<TResult>(prms, os);
    }

    handlePart(part: IQueryPart): QueryParameter {
        const args = part.args.map(a => expToStr(a.exp, a.scopes)).join(';');
        return { key: '$' + part.type, value: args };
    }
}

function expToStr(exp: Expression, scopes: any[]): string {
    switch (exp.type) {
        case ExpressionType.Literal:
            return convertValue((exp as LiteralExpression).value);
        case ExpressionType.Variable:
            return readVar((exp as VariableExpression), scopes);
        case ExpressionType.Unary:
            const uexp = exp as UnaryExpression;
            return `${getUnaryOp(uexp.operator)}${expToStr(uexp.target, scopes)}`;
        case ExpressionType.Group:
            const gexp = exp as GroupExpression;
            return `(${gexp.expressions.map(e => expToStr(e, scopes)).join(', ')})`;
        case ExpressionType.Object:
            const oexp = exp as ObjectExpression;
            const assigns = oexp.members.map(m => {
                if (m.type === ExpressionType.Assign) {
                    const ae = m as AssignExpression;
                    return `${expToStr(ae.right, scopes)} as ${ae.name}`;
                }

                return m.name;
            }).join(', ');
            return `new (${assigns})`;
        case ExpressionType.Array:
            const aexp = exp as ArrayExpression;
            return `new [${aexp.items.map(e => expToStr(e, scopes)).join(', ')}]`;
        case ExpressionType.Binary:
            const bexp = exp as BinaryExpression;
            return `${expToStr(bexp.left, scopes)} ${getBinaryOp(bexp.operator)} ${expToStr(bexp.right, scopes)}`;
        case ExpressionType.Member:
            const mexp = exp as MemberExpression;
            return `${expToStr(mexp.owner, scopes)}.${mexp.member.name}`;
        case ExpressionType.Indexer:
            const iexp = exp as IndexerExpression;
            return `${expToStr(iexp.owner, scopes)}[${expToStr(iexp.key, scopes)}]`;
        case ExpressionType.Func:
            const fexp = exp as FuncExpression;
            const a = {};
            fexp.parameters.forEach(p => a[p] = readProp(p, scopes));
            return expToStr(fexp.body, [a, ...scopes]);
        case ExpressionType.Call:
            const cexp = exp as CallExpression;
            return mapFunction(cexp, scopes);
        case ExpressionType.Ternary:
            const texp = exp as TernaryExpression;
            return `${expToStr(texp.predicate, scopes)} ? ${expToStr(texp.whenTrue, scopes)} : ${expToStr(texp.whenFalse, scopes)}`;
        default:
            throw new Error(`Unsupported expression type ${exp.type}`);
    }
}

function getBinaryOp(op: string) {
    if ('===') return '==';
    if ('!==') return '!=';

    return op;
}

function getUnaryOp(op: string) {
    return op;
}

function readVar(exp: VariableExpression, scopes: any[]) {
    return readProp(exp.name, scopes);
}

function readProp(member: string, scopes: any[]) {
    const s = scopes.find(s => member in s);
    return s ? s[member] : member;
}

function convertValue(value) {
    return value;
}

function mapFunction(call: CallExpression, scopes: any[]) {
    const callee = expToStr(call.callee, scopes);
    const args = call.args.map(a => expToStr(a, scopes)).join(', ');
    return `${callee}(${args})`;
} 
