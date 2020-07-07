import { IActions, IModelApis, IModelSchema } from './types';
declare function create<S extends object = any, Actions extends IActions = any>(model: IModelSchema<S, Actions>): IModelApis<S, Actions>;
export { create };
export { shallowEqual } from 'react-redux';
export { coreStore } from './codeStore';
export * from './Provider';
