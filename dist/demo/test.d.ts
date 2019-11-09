import { Model } from '@/types';
interface rootState {
    m1: {
        name: string;
    };
    m2: {
        id: number;
        name: string;
    }[];
}
declare type M1 = Model<rootState['m1'], 'put'>;
declare const m1: M1;
declare type M22 = Model<rootState['m2'], 'add', // 新增一条数据
'getUserInfo' | 'getUserInfo2'>;
declare const m2: M22;
export { m1, m2, rootState, };
