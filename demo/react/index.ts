import React from 'react';
import ReactDom from 'react-dom';
import { coreStore } from '../../src';
import './test';
import App from './App';

coreStore.set({
  d: { d: 1 },
  b: { b: 1 },
});

ReactDom.render(React.createElement(App), document.getElementById('root'));
