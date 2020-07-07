import React from 'react';

import { shallowEqual } from 'react-redux';
import userM from './user.model';

const User = () => {
  const state = userM.useModel(s => s, shallowEqual);

  return (
    <div>
      <h2>User</h2>
      <button type="button" onClick={userM.actions.setName}>
        setName
      </button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export default User;
