declare module "types" {
    import { Store, Unsubscribe } from 'redux';
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
    export interface IInitOptions {
        /** 作用于每个model的中间件，先于model级中间件执行 */
        middleware?: IMiddleware[];
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
        /** 注册model级的中间件 */
        middleware?: IMiddleware[];
        /** 模块所有action */
        actions?: Actions;
    }
    export interface IMiddlewareBonus {
        /** 该model的初始化状态 */
        initState: any;
        /** 中间件当前是否为初始化调用
         * 为true: 执行初始化操作
         * 为false: 执行中间件具体功能、增强api等
         * */
        isInit: boolean;
        /** 当前model的api */
        apis: IModelApis<any, any>;
        /** 在整个中间件执行上下文中共享的对象, 可用于不同中间件共享数据 */
        ctx: any;
        /** 当前中间件所属model的命名空间 */
        namespace: string;
        /** 底层redux store对象 */
        store: Store;
        /** 创建monkey patch的帮助函数，用来执行api增强操作 */
        monkeyHelper: IMonkeyHelper;
    }
    /**
     * 中间件
     * 每个中间件会有两个执行阶段：
     * 1. `model`初始化, `bonus.isInit` 为 `true`，此阶段可以执行一些初始化操作，或者更改model的初始state
     *    - 如果对参数bonus使用了解构语法如 `{ initState, isInit, ... }`, 需确保其引用地址不变, 即只能`initState.xx = xx`, 不能 `initState = xx`
     *    - 如果要替换整个`initState`, 可以直接将待替换的状态`return`
     *    - 未使用结构时，`bonus.initState.xx = xx` 或是 `bonus.initState = xx` 都是可以的
     * 2. 阶段2，内置api已生成, `bonus.isInit` 为 `false`，此阶段交由中间件开发者对各种api执行增强操作或其他钩子式的行为。
     * */
    export interface IMiddleware {
        (bonus: IMiddlewareBonus): any;
    }
    export interface IMonkeyHelper {
        <Name extends keyof IModelApis<any, any>>(name: Name, cb: (next: IModelApis<any, any>[Name]) => IModelApis<any, any>[Name]): void;
    }
}
declare module "actions" {
    export const modelInitMatch: RegExp;
    export const modelInitAction: (namespace: string, state: any) => {
        type: string;
        state: any;
        namespace: string;
    };
    export const setStateMatch: RegExp;
    export const setStateAction: (namespace: string, state: any) => {
        type: string;
        state: any;
        namespace: string;
    };
    export const setRootStateMatch = "setState";
    /**
     * 直接设置根状态
     * @param state - 带设置的状态
     * @param replace - 为true时，使用传入状态替换整个状态树
     * */
    export const setRootState: (state: any, replace?: boolean | undefined) => {
        type: string;
        state: any;
        replace: boolean | undefined;
    };
}
declare module "shareData" {
    import { IListener, IMiddleware, IModelApis } from "types";
    const _default: {
        /** 保存更新前的state */
        lastState: any;
        /** 所有subscribe监听器 */
        listeners: {
            [key: string]: IListener<any>[];
        };
        /** 所有已注册的model */
        models: IModelApis<any, any>[];
        /** 全局注册的中间件 */
        middleware: IMiddleware[];
        /** 是否已创建过model，用于识别init与create的执行顺序 */
        modelCreated: boolean;
        /** init调用计数, 防止多次调用 */
        initCount: number;
    };
    export default _default;
}
declare module "utils" {
    import { IMiddleware } from "types";
    export function getDevToolCompose(): any;
    /**
     * 合并全局和model级中间件，并将各类型的中间件处理器分组返回
     * */
    export function middlewareHelper(scopeMiddleware?: IMiddleware[]): IMiddleware[];
    export function logText(text: string, namespace?: string): string;
    export function prefix(text: string): string;
}
declare module "store" {
    const store: import("redux").Store<any, import("redux").Action<any>>;
    export { store };
}
declare module "api" {
    import { AnyFunction } from '@lxjx/utils';
    import { IGet, IListener } from "types";
    export function createGet(namespace?: string): () => any;
    export function createSet<S>(namespace: string, get: IGet<S>): (patch: ((prevState: S) => Partial<S>) | Partial<S>) => void;
    export function createSubscribe<S = any>(namespace: string): (listener: IListener<S>) => () => void;
    export function createUseModel(namespace: string): (selector?: AnyFunction | undefined, equalityFn?: AnyFunction | undefined) => any;
    export function createListener(namespace: string): void;
}
declare module "actionsHandle" {
    import { IActions } from "types";
    export default function actionsHandle(namespace: string, actions?: IActions): void;
}
declare module "codeStore" {
    import { AnyObject } from '@lxjx/utils';
    import { IInitOptions, IListener } from "types";
    function get<S extends AnyObject = any>(): S;
    /**
     * 直接设置根状态
     * @param patch - 带设置的状态
     * @param replace - 为true时，使用传入状态替换整个状态树
     * */
    function set<S extends AnyObject = any>(patch: ((prevState: S) => Partial<S>) | Partial<S>, replace?: boolean): void;
    function subscribe<S = any>(listener: IListener<S>): import("redux").Unsubscribe;
    function init({ middleware }: IInitOptions): void;
    const coreStore: {
        get: typeof get;
        set: typeof set;
        subscribe: typeof subscribe;
        models: import("types").IModelApis<any, any>[];
        init: typeof init;
    };
    export { coreStore };
}
declare module "Provider" {
    import React from 'react';
    import { IInitOptions } from "types";
    const Provider: React.FC<IInitOptions>;
    export { Provider };
}
declare module "index" {
    import { IActions, IModelApis, IModelSchema } from "types";
    function create<S extends object = any, Actions extends IActions = any>(model: IModelSchema<S, Actions> | ((apis: IModelApis<S, Actions>) => IModelSchema<S, Actions>)): IModelApis<S, Actions>;
    export { create };
    export { coreStore } from "codeStore";
    export * from "Provider";
}
declare module "cache" {
    import { IMiddleware } from "types";
    const cache: IMiddleware;
    export default cache;
}
declare module "log" {
    import { IMiddleware } from "types";
    const log: IMiddleware;
    export default log;
}
declare module "shallowEqual" {
    import { shallowEqual } from 'react-redux';
    export default shallowEqual;
}
