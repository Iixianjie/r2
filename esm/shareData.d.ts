import { IListener, IModelApis } from './types';
declare const _default: {
    /** 保存更新前的state */
    lastState: any;
    /** 所有subscribe监听器 */
    listeners: IListener<any>[];
    /** 所有已注册的model */
    models: IModelApis<any, any>[];
};
export default _default;
