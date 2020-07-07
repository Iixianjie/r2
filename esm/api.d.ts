import { AnyFunction } from '@lxjx/utils';
import { IGet, IListener } from './types';
export declare function createGet(namespace?: string): () => any;
export declare function createSet<S>(namespace: string, get: IGet<S>): (patch: ((prevState: S) => Partial<S>) | Partial<S>) => void;
export declare function createSubscribe<S = any>(): (listener: IListener<S>) => () => void;
export declare function createUseModel(namespace: string): (selector?: AnyFunction | undefined, equalityFn?: AnyFunction | undefined) => any;
export declare function createListener(namespace: string): void;
