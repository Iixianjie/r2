import { IListener, IMiddleware, IModelApis } from './types';

export default {
  /** 保存更新前的state */
  lastState: null as any,
  /** 所有subscribe监听器 */
  listeners: [] as IListener<any>[],
  /** 所有已注册的model */
  models: [] as IModelApis<any, any>[],
  /** 全局注册的中间件 */
  middleware: [] as IMiddleware[],
  /** 是否已创建过model，用于识别init与create的执行顺序 */
  modelCreated: false,
  /** init调用计数, 防止多次调用 */
  initCount: 0,
};
