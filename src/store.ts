import { createStore } from 'redux';
import {
  modelInitAction,
  modelInitMatch,
  setRootState,
  setRootStateMatch,
  setStateAction,
  setStateMatch,
} from './actions';
import shareData from './shareData';
import { getDevToolCompose } from './utils';

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
