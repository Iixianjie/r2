import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import { store } from './store';
var Provider = function (_a) {
    var children = _a.children;
    return React.createElement(ReduxProvider, { store: store }, children);
};
Provider.displayName = 'R2Provider';
export { Provider };
