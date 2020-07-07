export const modelInitMatch = /^@@MODEL_INIT_.+$/;

export const modelInitAction = (namespace: string, state: any) => ({
  type: `@@MODEL_INIT_${namespace.toUpperCase()}`,
  state,
  namespace,
});

export const setStateMatch = /^.+\.setState$/;

export const setStateAction = (namespace: string, state: any) => ({
  type: `${namespace}.setState`,
  state,
  namespace,
});

export const setRootStateMatch = 'setState';
/**
 * 直接设置根状态
 * @param state - 带设置的状态
 * @param replace - 为true时，使用传入状态替换整个状态树
 * */
export const setRootState = (state: any, replace?: boolean) => ({
  type: setRootStateMatch,
  state,
  replace,
});
