import { isFunction } from '@lxjx/utils';
import { IMiddleware } from './types';
import { logText } from './utils';

const log: IMiddleware = {
  init(initState, { namespace }) {
    console.log(logText('model init: ', namespace), initState);
    return initState;
  },

  transform(modelApi, { namespace }): any {
    const monkeyGet = modelApi.get;

    console.log(
      logText('contain actions: ', namespace),
      Object.keys(modelApi.actions || {}).join(', '),
    );

    modelApi.get = () => {
      const s = monkeyGet();
      console.log(logText('get(): ', namespace), s);
      return s;
    };

    const monkeySet = modelApi.set;

    modelApi.set = (patch: any) => {
      console.log(logText('set(): ', namespace), isFunction(patch) ? 'is patch function' : patch);
      monkeySet(patch);
    };

    const monkeyUseModel = modelApi.useModel;

    modelApi.useModel = (...args) => {
      const s = monkeyUseModel(...args);

      console.log(logText('useModel() mount, state is: ', namespace), s);
      return s;
    };

    const subscribeModel = modelApi.subscribe;

    modelApi.subscribe = listener => {
      console.log(logText('listener is subscribe', namespace));

      const us = subscribeModel(listener);

      return () => {
        console.log(logText('listener is unSubscribe', namespace));

        us();
      };
    };

    return modelApi;
  },
};

export default log;
