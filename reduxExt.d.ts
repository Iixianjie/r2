import 'redux';
import { EffectFn, ReducerFn } from '@/types';

declare module 'redux' {
  export interface Dispatch {
    (arg: ReducerFn<any>, payload?: any): void;
    (arg: EffectFn<any>, payload?: any): Promise<any>;
  }
  export interface Middleware<
      DispatchExt = {},
      S = any,
      D extends Dispatch = Dispatch
    > {
    (api: MiddlewareAPI<D, S>): (
      next: Dispatch<AnyAction>
    ) => (action: any, payload?: any) => any
  }
}
