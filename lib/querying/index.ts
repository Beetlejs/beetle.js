import { IQueryProvider, IQueryPart, Query, QueryPart, PartArgument, QueryFunc } from 'jinqu';
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
    call<T>(prms: QueryParameter[], options: TOptions): PromiseLike<IteratorResult<T>>
}

export interface BeetleQueryOptions extends WebRequestOptions {
    noTracking?: boolean;
}

export class BeetleQuery<T> extends Query<T> {

    withOptions(options: BeetleQueryOptions) {
        return this._create(QueryPart.create(WebFunc.options, [PartArgument.literal(options)]));
    }

    asNoTracking() {
        return this._create(QueryPart.create(WebFunc.options, [PartArgument.literal({ noTracking: true })]));
    }

    // todo: jinqu update sonrası silinecek
    private _create<TResult = T>(part: IQueryPart): BeetleQuery<TResult> {
        return <any>this.provider.createQuery([...this.parts, part]);
    }
}

export class WebQueryProvider<TOptions extends WebRequestOptions> implements IQueryProvider {

    constructor(protected requestProvider: IRequestProvider<TOptions>) {
    }

    createQuery<T>(parts?: IQueryPart[]) {
        return new Query<T>(this, parts);
    }

    execute<T = any, TResult = PromiseLike<IteratorResult<T>>>(parts: IQueryPart[]): TResult {
        const prms: QueryParameter[] = [];
        let o = {};

        for (let p of parts) {
            if (p.type === WebFunc.options) {
                o = Object.assign(o, p.args[0].literal);
            } else {
                prms.push(handle(p));
            }
        }

        return <TResult><any>this.requestProvider.call<T>(prms, <TOptions>o);
    }
}

function handle(part: IQueryPart): QueryParameter {
    const args = part.args.map(a => expToStr(a.exp, a.scopes)).join(';');
    return { key: '$' + part.type, value: args };
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
