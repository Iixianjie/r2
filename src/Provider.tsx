import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import { store } from './store';

const Provider: React.FC = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

Provider.displayName = 'R2Provider';

export { Provider };
