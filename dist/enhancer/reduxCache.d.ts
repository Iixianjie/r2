import { StoreEnhancer } from 'redux';
interface ReduxCacheFactory {
    (options?: {
        /** 用于存储到sessionStorage的key */
        cacheKey?: string;
        /** 当此项长度大于0时，只会缓存该数组内指定的key */
        includes?: any[];
    }): StoreEnhancer;
}
declare const reduxCacheFactory: ReduxCacheFactory;
export default reduxCacheFactory;
