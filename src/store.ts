import { createStore } from 'redux';
import {
  modelInitAction,
  modelInitMatch,
  setStateAction,
  setStateMatch,
  setRootState,
  setRootStateMatch,
} from './actions';
import shareData from './shareData';

function getDevToolCompose() {
  if (typeof window === 'undefined' || typeof process === 'undefined') {
    return;
  }
  // @ts-ignore
  if (process.env.NODE_ENV !== 'development' || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    return;
  }
  // @ts-ignore
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__();
}

getDevToolCompose();

const store = createStore(
  (state: any = {}, { type, ...action }) => {
    shareData.lastState = state;

    if (modelInitMatch.test(type)) {
      const { state: initState, namespace } = action as ReturnType<typeof modelInitAction>;

      return {
        ...state,
        [namespace]: initState,
      };
    }

    if (setStateMatch.test(type)) {
      const { state: patchState, namespace } = action as ReturnType<typeof setStateAction>;

      return {
        ...state,
        [namespace]: {
          ...state[namespace],
          ...patchState,
        },
      };
    }

    if (type === setRootStateMatch) {
      const { state: rootState, replace } = action as ReturnType<typeof setRootState>;
      if (replace) {
        return rootState;
      }

      return {
        ...state,
        ...rootState,
      };
    }

    return state;
  },
  {},
  getDevToolCompose(),
);

export { store };
