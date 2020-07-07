import { AnyObject } from '@lxjx/utils';
import { IListener } from './types';
declare function get<S extends AnyObject = any>(): S;
/**
 * 直接设置根状态
 * @param patch - 带设置的状态
 * @param replace - 为true时，使用传入状态替换整个状态树
 * */
declare function set<S extends AnyObject = any>(patch: ((prevState: S) => Partial<S>) | Partial<S>, replace?: boolean): void;
declare function subscribe<S = any>(listener: IListener<S>): import("redux").Unsubscribe;
declare const coreStore: {
    get: typeof get;
    set: typeof set;
    subscribe: typeof subscribe;
    models: import("./types").IModelApis<any, any>[];
};
export { coreStore };
