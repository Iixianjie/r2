import { isFunction } from '@lxjx/utils';
import { IMiddleware } from './types';
import { logText } from './utils';

const log: IMiddleware = ({ isInit, initState, namespace, apis, monkeyHelper }) => {
  if (isInit) {
    console.log(logText('model init: ', namespace), initState);
    return;
  }

  console.log(logText('contain actions: ', namespace), Object.keys(apis.actions || {}).join(', '));

  monkeyHelper('get', next => () => {
    const s = next();
    console.log(logText('get(): ', namespace), s);
    return s;
  });

  monkeyHelper('set', next => patch => {
    console.log(logText('set(): ', namespace), isFunction(patch) ? 'is patch function' : patch);
    next(patch);
  });

  monkeyHelper('useModel', next => (...args) => {
    const s = next(...args);

    console.log(logText('useModel() mount, state is: ', namespace), s);
    return s;
  });

  monkeyHelper('subscribe', next => listener => {
    console.log(logText('listener is subscribe', namespace));

    const us = next(listener);

    return () => {
      console.log(logText('listener is unSubscribe', namespace));

      us();
    };
  });
};

export default log;
