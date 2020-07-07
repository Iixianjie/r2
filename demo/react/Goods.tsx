import React from 'react';

import goodsM from './goods.model';

const Goods = () => {
  const state = goodsM.useModel();

  return (
    <div>
      <h2>Goods</h2>
      <button type="button" onClick={goodsM.actions.getGoods}>
        getGoods
      </button>
      <button type="button" onClick={goodsM.actions.rollbackList}>
        rollback goods
      </button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
};

export default Goods;
