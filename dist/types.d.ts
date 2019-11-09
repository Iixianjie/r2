import { StoreEnhancer, Dispatch, MiddlewareAPI, AnyAction } from 'redux';
/** dispatch签名扩展 */
export interface DispatchExt {
    (arg: ReducerFn<any>, payload?: any): void;
    (arg: EffectFn<any>, payload?: any): Promise<any>;
}
/** 扩展中间件类型 */
export interface Middleware2<DispatchExt = {}, S = any, D extends Dispatch = Dispatch> {
    (api: MiddlewareAPI<D, S>): (next: Dispatch<AnyAction>) => (action: any, payload?: any) => any;
}
/**
 * model.reducer.[fn] 的类型
 * <T>: 该model的State
 * */
export interface ReducerFn<T> {
    (state: T, payload: any): T;
    type?: string;
}
/**
 * model.effects.[fn] 的类型
 * */
export interface EffectFn<S> {
    (payload: any, extra: {
        dispatch: Dispatch;
        getState: () => S;
    }): any;
    type?: string;
}
/**
 * model接口
 * <T>: 该model的State
 * */
export interface IModel<T> {
    state?: T;
    reducers?: {
        [key: string]: ReducerFn<T>;
    };
    effects?: {
        [key: string]: EffectFn<T>;
    };
}
/**
 * 用户定义的model接口
 * <S>: 当前model的state
 * <R>: reducers中包含的所有键组成的联合类型
 * <E>: effects中包含的所有键组成的联合类型
 * */
export interface Model<S, R extends string = any, E extends string = any> {
    state?: S;
    reducers: {
        [key in R]: ReducerFn<S>;
    };
    effects: {
        [key in E]: EffectFn<S>;
    };
}
/**
 * createStoreEnhance的配置项
 * <S>: 描述整个state树的接口
 * */
export interface CreateStoreEnhanceOptions<S> {
    /** IModel接口实现组成的map对象 */
    models: {
        [namespace: string]: IModel<any>;
    };
    /** 初始状态，优先级高于model.state, 必须是完整的state树 */
    initState?: S;
    /** 与redux -> createStore()的enhancer相同 */
    enhancer?: StoreEnhancer<any, any>;
}
