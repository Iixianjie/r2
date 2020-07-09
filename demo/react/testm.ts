import { IMiddleware } from '../../src/types';

const test1: IMiddleware = ({ isInit, initState, namespace, monkeyHelper }) => {
  if (isInit) {
    console.log(`test1 ${namespace} init`, initState);
    // initState.test1 = 'test1 inject';
    return {
      ...initState,
      test1: 'test1 inject',
    };
  }

  if (!isInit) {
    monkeyHelper('set', next => patch => {
      console.log(`test1 ${namespace} set`);
      next(patch);
    });
  }
};

const test2: IMiddleware = ({ isInit, initState, namespace, monkeyHelper }) => {
  if (isInit) {
    console.log(`test2 ${namespace} init`, initState);
    // initState.test2 = 'test2 inject';
    return {
      ...initState,
      test2: 'test2 inject',
    };
  }

  if (!isInit) {
    monkeyHelper('set', next => patch => {
      console.log(`test2 ${namespace} set`);
      next(patch);
    });
  }
};

const test3: IMiddleware = ({ isInit, initState, namespace, monkeyHelper }) => {
  if (isInit) {
    console.log(`test3 ${namespace} init`, initState);
    // initState.test2 = 'test2 inject';
    return {
      ...initState,
      test3: 'test3 inject',
    };
  }

  if (!isInit) {
    monkeyHelper('set', next => patch => {
      console.log(`test3 ${namespace} set`);
      next(patch);
    });
  }
};

export { test1, test2, test3 };
