import { StoreEnhancer } from 'redux';


interface Reducer<T> {
  (state: T, payload: any): T;
  signKey?: string;
}

interface Effect {
  (payload: any, extra: { dispatch: any, getState: any }): any;
  signKey?: string;
}

/**
 * <T>: 该模块的state
 * */
export interface Model<T> {
  state?: T;
  reducers?: {
    [key: string]: Reducer<T>;
  }
  effects?: {
    [key: string]: Effect;
  }
}

/**
 * <S>: 整个state树的类型
 * */
export interface CreateStoreOptions<S> {
  models: {
    [namespace: string]: Model<any>;
  };
  initState?: S;
  enhancer?: StoreEnhancer;
}
