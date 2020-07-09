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
  /** 在整个中间件执行上下文中共享的对象, 可用于不同中间件共享数据 */
  ctx: any;
  /** model的命名空间 */
  namespace: string;
  /** 底层redux store对象 */
  store: Store;
}

/**
 * 中间件
 * */
export interface IMiddleware {
  /** 每个model创建时触发，接收initState并以返回值作为初始state */
  init?(initState: any, bonus: IMiddlewareBonus): any;

  /**
   * 模块创建后，将api发送到用户之前，所有api会先经过此方法
   * - 可以将最终api包装(通过monkey patch)修改后返回给用户，从而达到类似redux的enhancer或中间件的效果
   * - 可以通过此方法实现除了init()外的所有插件钩子
   * @example
   * transform(modelApis) {
   *   // 可以把这种写法想象成类组件方法继承中的`super.xx(arg)`
   *   const set = modelApis.set;
   *   modelApis.set = (state) => {
   *     // 处理state
   *     // ...
   *     // 将处理后的state传递给set()
   *     set(finalState);
   *   }
   *   // 返回修改后的api
   *   return modelApis;
   * }
   * */
  transform?(modelApi: IModelApis<any, any>, bonus: IMiddlewareBonus): any;
}
