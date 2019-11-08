import { StoreEnhancer, Dispatch } from 'redux';

declare module 'redux' {
  interface Dispatch {
    (arg: ReducerFn<any>, payload?: any): void;
    (arg: EffectFn<any>, payload?: any): Promise<any>;
  }
}

/**
 * model.reducer.[fn] 的类型
 * <T>: 该model的State
 * */
export interface ReducerFn<T> {
  (state: T, payload: any): T;
  signKey?: string;
}

/**
 * model.effects.[fn] 的类型
 * */
export interface EffectFn<S> {
  (payload: any, extra: { dispatch: Dispatch, getState: S }): any;
  signKey?: string;
}

/**
 * model接口
 * <T>: 该model的State
 * */
export interface Model<T> {
  state?: T;
  reducers?: {
    [key: string]: ReducerFn<T>;
  }
  effects?: {
    [key: string]: EffectFn<T>;
  }
}

/**
 * createStoreEnhance的配置项
 * <S>: 描述整个state树的接口
 * */
export interface CreateStoreEnhanceOptions<S> {
  models: {
    [namespace: string]: Model<any>;
  };
  initState?: S;
  enhancer?: StoreEnhancer;
}

