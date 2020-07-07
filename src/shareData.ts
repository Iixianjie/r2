import { IListener, IModelApis } from './types';

export default {
  /** 保存更新前的state */
  lastState: null as any,
  /** 所有subscribe监听器 */
  listeners: [] as IListener<any>[],
  /** 所有已注册的model */
  models: [] as IModelApis<any, any>[],
};
