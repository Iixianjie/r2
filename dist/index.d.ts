import reduxCacheFactory from './enhancer/reduxCache';
import { CreateStoreEnhanceOptions } from './types';
/**
 * 创建store
 * <S>: 整个state树的类型
 * */
declare const createStoreEnhance: <S>({ models, initState, enhancer }: CreateStoreEnhanceOptions<S>) => import("redux").Store<S, import("redux").Action<any>>;
export * from './types';
export { reduxCacheFactory, };
export default createStoreEnhance;
