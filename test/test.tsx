import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { create, Provider } from '../src';

function createModel() {
  const m1 = create({
    namespace: 'user',
    state: {
      name: 'lxj',
      age: 18,
    },
    actions: {
      setName() {
        m1.set({ name: 'jxl' });
      },
    },
  });
  return m1;
}

test('create', () => {
  const m = create({
    namespace: 'createTest',
    state: {
      num: 1,
    },
    actions: {
      setNum() {},
    },
  });

  expect(m).toMatchObject({
    get: expect.any(Function),
    set: expect.any(Function),
    actions: expect.objectContaining({ setNum: expect.any(Function) }),
    subscribe: expect.any(Function),
    useModel: expect.any(Function),
  });

  expect(m.get()).toEqual({ num: 1 });
});

describe('modal api', () => {
  test('model.get()', () => {
    const userM = createModel();

    expect(userM.get()).toEqual({ name: 'lxj', age: 18 });
  });

  test('model.set()', () => {
    const userM = createModel();

    userM.set({
      name: 'jxl',
    });

    expect(userM.get()).toEqual({ name: 'jxl', age: 18 });

    userM.set(prev => ({
      name: 'lxj',
      age: prev.age + 1,
    }));

    expect(userM.get()).toEqual({ name: 'lxj', age: 19 });
  });

  test('model.actions', done => {
    const userM = create({
      namespace: 'user',
      state: {
        name: 'lxj',
      },
      actions: {
        async setName(name: string) {
          userM.set({ name });

          return name;
        },
      },
    });

    expect.assertions(3);

    expect(userM.actions).toMatchObject({
      setName: expect.any(Function),
    });

    userM.actions
      .setName('hello')
      .then(newName => {
        expect(newName).toBe('hello');
        expect(userM.get()).toEqual({ name: 'hello' });
        done();
      })
      .catch(done);
  });

  test('subscribe', () => {
    const userM = create({
      namespace: 'subscribeTest',
      state: {
        name: 'lxj',
      },
    });

    const listener = jest.fn(state => state);

    const us = userM.subscribe(listener);
    userM.subscribe(listener);

    userM.set({ name: 'jxl' });

    us();

    userM.set({ name: 'lxj' });

    expect(listener.mock.calls.length).toBe(3);
    expect(listener).toHaveBeenNthCalledWith(1, { name: 'jxl' });
    expect(listener).toHaveBeenNthCalledWith(2, { name: 'jxl' });
    expect(listener).toHaveBeenNthCalledWith(3, { name: 'lxj' });
  });

  test('useModel test', () => {
    const countM = create({
      namespace: 'count',
      state: {
        num: 0,
      },
    });

    const countM2 = create({
      namespace: 'count2',
      state: {
        num: 0,
      },
    });

    const Counter: any = jest.fn(() => {
      const state = countM.useModel();

      return <div onClick={() => countM.set(prev => ({ num: prev.num + 1 }))}>{state.num}</div>;
    });

    const { container } = render(
      <Provider>
        <Counter />
      </Provider>,
    );

    const getText = () => (container.firstChild as any).innerHTML;

    const click = () => fireEvent.click(container.firstChild as any);

    expect(getText()).toBe('0');

    click();

    expect(getText()).toBe('1');

    click();
    click();

    expect(getText()).toBe('3');

    // 测试相邻model更新是否会影响组件更新
    countM2.set({ num: 10 });

    // 初始化 + 三次更新
    expect(Counter.mock.calls.length).toBe(4);
  });
});
