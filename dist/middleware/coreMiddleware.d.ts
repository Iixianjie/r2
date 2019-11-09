import { DispatchExt, Middleware2 } from '../types';
/**
 * 此中间件帮助store.dispatch识别dispatch(reducerFn, action)以及dispatch(async effectFn, action)
 * 作为参数的函数应包含属性type(<namespace>.<reducer|effects>.<handleKey>), 如: user.effect.getUserInfo、user.reducer.setUserInfo
 * 需要确保一个能监听action.__fnReducer的reducer存在，当__fnReducer为true时，用action.__localState合并当前state
 * */
declare const coreMiddleware: Middleware2<DispatchExt>;
export default coreMiddleware;
