import { Unsubscribe } from 'redux';
export interface IGet<S> {
    (): S;
}
export interface ISet<S> {
    (patch: ((prevState: S) => Partial<S>) | Partial<S>): void;
}
export interface IUseModel<S> {
    <TS = S>(selector?: (state: S) => TS, equalityFn?: (prev: TS, next: TS) => boolean): TS;
}
export interface IListener<S> {
    (state: S): void;
}
export interface IActions {
    [key: string]: (...arg: any[]) => Promise<any> | void;
}
export interface IModelApis<S, Actions> {
    /** 获取当前状态 */
    get: IGet<S>;
    /** 设置当前状态, 类似类组件this.setState用法 */
    set: ISet<S>;
    /** 所有与model绑定的action，可直接调用 */
    actions: Actions;
    /** 注册一个状态变更监听器 */
    subscribe: (listener: IListener<S>) => Unsubscribe;
    /**
     * 从store中获取state的hook
     * @param selector - 接收当前state，返回值作为状态返回给hook
     * @param equalityFn - 自定义对比函数，可通过此函数进行性能优化
     * @return 返回的状态
     * */
    useModel: IUseModel<S>;
}
export interface IModelSchema<S extends object = any, Actions extends IActions = any> {
    /** 模块的命名空间 */
    namespace: string;
    /** 模块状态 */
    state: S;
    /** 模块所有action */
    actions?: Actions;
}
