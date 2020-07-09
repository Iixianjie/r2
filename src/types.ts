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
  <Name extends keyof IModelApis<any, any>>(
    name: Name,
    cb: (next: IModelApis<any, any>[Name]) => IModelApis<any, any>[Name],
  ): void;
}
