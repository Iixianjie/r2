import { IMiddleware } from '../../src/types';

const test1: IMiddleware = ({ isInit, initState, apis, namespace, monkeyHelper }) => {
  if (isInit) {
    console.log('init', initState);
  }
};
