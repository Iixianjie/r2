export declare const modelInitMatch: RegExp;
export declare const modelInitAction: (namespace: string, state: any) => {
    type: string;
    state: any;
    namespace: string;
};
export declare const setStateMatch: RegExp;
export declare const setStateAction: (namespace: string, state: any) => {
    type: string;
    state: any;
    namespace: string;
};
export declare const setRootStateMatch = "setState";
/**
 * 直接设置根状态
 * @param state - 带设置的状态
 * @param replace - 为true时，使用传入状态替换整个状态树
 * */
export declare const setRootState: (state: any, replace?: boolean | undefined) => {
    type: string;
    state: any;
    replace: boolean | undefined;
};
