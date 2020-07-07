import React from 'react';
import { Provider } from '../../src';
import User from './User';
import Goods from './Goods';

const App = () => {
  return (
    <Provider>
      <div>App</div>
      <User />
      <Goods />
    </Provider>
  );
};

export default App;
