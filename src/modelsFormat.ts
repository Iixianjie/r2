import signModel from './signModel';

import { CreateStoreEnhanceOptions } from '@/types';

/* 为对象内的所有model函数打上sing并将它们的state组合后进行返回 */
export default <S>(models: CreateStoreEnhanceOptions<S>['models']) => {
  const mixState: any = {};
  for (let [namespace, model] of Object.entries(models)) {
    mixState[namespace as keyof S] = signModel(model, namespace);
  }
  return mixState;
}
