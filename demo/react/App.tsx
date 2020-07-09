import React from 'react';
import { Provider } from '../../src';
import User from './User';
import Goods from './Goods';
import log from '../../src/log';

const App = () => {
  return (
    <Provider middleware={[log]}>
      <div>App</div>
      <User />
      <Goods />
    </Provider>
  );
};

export default App;
