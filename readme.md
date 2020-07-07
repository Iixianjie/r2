<h1 align="center" style="color: #61dafb;">r2</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">🌼</h1> 



<p align="center">r2(redux reduce): Model, async effect, ide and typescript friendly, without boilerplate code</p>

<br>
<br>


<!-- TOC -->

- [**✨Features**](#✨features)
- [**🔥快速上手**](#🔥快速上手)
- [**📘API**](#📘api)
  - [`create(modelSchema)`](#createmodelschema)
  - [`modelSchema`](#modelschema)
  - [`model`](#model)
  - [`coreStore`](#corestore)
- [`shallowEqual`](#shallowequal)
- [TODO](#todo)
- [💡FQA](#💡fqa)

<!-- /TOC -->


<br>

<br />

## **✨Features** 

* 以`model`的形式组织`state` 。
* 不写用`reducer` 、`dispatch`🎉, 无样板代码。
* 很好的 `Idea`、编辑器、`typescript`支持。
* 少量api，少量概念。
* 通过`react hooks` 使用。
* 可使用`redux devtool`。



<br>

<br>

## **🔥快速上手**

1. 在组件层级的最顶层注册`Provider`

```tsx
import { Provider } from '@lxjx/r2';

const App = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};
```



2. 编写`model`

```ts
import { create } from '@lxjx/r2';

const userM = create({
  namespace: 'user',
  state: {
    name: 'lxj',
    age: 18,
  },
  actions: {
    setName() {
      userM.set({
        name: 'lxj',
      });
      // or
      // userM.set(prev => ({
      //   name: 'lxj',
      // }));
    },
  },
});

// 实际使用中，model会被分别放置到不同的文件中
const goodsM = create({
  namespace: 'goods',
  state: {
    list: [] as any[],
    date: Date.now(),
  },
  actions: {
    // asunc action
    async getGoods() {
      const list = await delay(1500);

      goodsM.set({
        list,
      });
    },
  },
});

export { userM, goodsM };
```



3. 使用model

```tsx
import React from 'react';

import userM from './models';

const User = () => {
  const user = userM.useModel();
  // 等价于 =>
  // const user = userM.useModel(state => state);
 

  return (
    <div>
      <h2>User</h2>
      <button type="button" onClick={userM.actions.setName}>
        setName
      </button>
      <div>{state.name}</div>
      <div>{state.age}</div>
    </div>
  );
};

export default User;
```



<br>

<br>

## **📘API**

### `create(modelSchema)`

`const model = create(modelSchema)`

创建并返回一个`model`



<br>

### `modelSchema`

用于创建`model`的对象

```ts
const userM = create({
  // 该model的命名空间，必传
  namespace: 'user',
  // 组件状态
  state: {
    name: 'lxj',
    age: 18,
  },
  // 包含一组action函数的对象，action函数可以是同步函数或async函数，当然, 你也可以用它返回Promise。
  actions: {
    setName() {
      userM.set(prev => ({
        name: String(Math.random()),
        age: prev.age - 1,
      }));
    },
  },
});
```



<br>

### `model`

由`create`函数创建, 一组独立的状态以及一些对状态进行操作的api

```ts
interface IModelApis {
  /** 获取当前状态 */
  get: () => State;
  /** 设置当前状态, 类似类组件this.setState用法 */
  set: (patch: partialState | prevState => partialState);
  /** 所有与model绑定的action，可直接调用 */
  actions: Actions;
  /** 注册一个状态变更监听器 */
  subscribe: (listener: state => void) => Unsubscribe;
  /**
   * 从store中获取state的hook
   * @param selector - 接收当前state，返回值作为状态返回给hook
   * @param equalityFn - 自定义对比函数，可通过此函数进行性能优化
   * @return 返回的状态
   * */
  useModel: (
    selector: state => state, 
    equalityFn: (prev, next) => boolean
  ) => state;
}
```



通过这组api，你可以在react以外的环境进行状态管理



<br>

### `coreStore` 

所有`model`都由一个根 `store` 管理，根 `store` 包含一些类似`model`的api

```ts
import { coreStore } from '@lxjx/r2';

// 订阅状态变更，接收的是所有model状态组成的根状态
coreStore.subscribe
// 与model.set用法一样，但是其设置的是根状态，并且提供replace参数，为true时会使用传入值替换整个state树
coreStore.set(patch, replace?: boolean)
// 获取根状态
coreStore.get
// 存放着所有以注册的model
coreStore.models
```



<br>

## `shallowEqual`

用于性能优化，`state`变更时对传入值进行浅层对比，如果对比结果相同则跳过组件更新，不过，只要不是同事改变了所有`model`的对象引用，通常很少会用到它。

```tsx
import { shallowEqual } from '@lxjx/r2';
// ...

function Xxx() {
    const state = userM.useModel(s => s.list, shallowEqual);
    
    return <div></div>
}
```



如果你需要更精确的对比，可以使用`lodash.isEqual()`或者任意接口一致的函数。


<br>

## TODO
- [ ] 中间件api or 插件api

<br>

## 💡FQA

**API?**

* 简化了`redux`中, `reducer/action/dispatch`等概念

* 所有改变state的操作由`set`方法完成。

* 通过`action`函数来进行一组完整的`set`操作。

形如 `dispatch({ type: 'INCREMENT' })`这样的写法，其目的是触发一个以字符`'INCREMENT'` 标识的唯一动作来告知`reducer`要如何处理状态。

这样做存在一些问题:

1. 通过字符串标识动作，维护困难，因为 ： idea和typescript支持均不友好，代码稍微复杂之后只能靠全局搜索来查找目标代码。
2. 模板代码太多，打击声明状态的积极性...



在`r2` 中，通过`userM.actions.getUsers()`来触发一个action，action即表示动作(一个唯一内存地址的函数), 又包含着实际的流程操作, 它承载的是类似`dispatch(action)`这样的操作。

在通过action进行操作后，再通过`set()`来将最后结果更新到state中，就完成了和

`dispatch(action)` => `reducer() => newState` 相同的操作，而且，action和set可以自由组合，使用更方便。



对idea和typescript来说，action就是一个简单的对象方法，点击即可跳转，并且有完整的类型定义。



*  action既可以是同步的，也可以是异步的, 类似:

```ts
userM.actions.setName('lxj');

userM.actions.getUsers()
	.then(() => {
    	console.log('完成');
	});
```



**redux devtool**

安装即可使用












