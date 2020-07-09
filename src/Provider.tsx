import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import { isArray } from '@lxjx/utils';
import { store } from './store';
import { IInitOptions } from './types';
import { coreStore } from './codeStore';

const Provider: React.FC<IInitOptions> = ({ children, ...props }) => {
  React.useMemo(() => {
    if (isArray(props.middleware) && props.middleware.length) {
      coreStore.init(props);
    }
  }, []);

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

Provider.displayName = 'R2Provider';

export { Provider };
