<h1 align="center" style="color: #61dafb;">redux-reduce</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">🌼</h1>

<p align="center">Modular redux, asynchronous operation with Async/Promise</p>

<br>

<p align="center"><a href="https://github.com/Iixianjie/redux-reduce">中文</a> | English</p>

<br>

<!-- TOC -->

- [✨Features](#✨features)
- [📦Installation](#📦installation)
- [📺guide](#📺guide)
- [📙API](#📙api)
  - [`createStoreEnhancer`](#createstoreenhancer)
- [other](#other)
  - [`Replace the root state`](#replace-the-root-state)
  - [`setState`](#setstate)
  - [`devtool`](#devtool)
  - [`连锁effect`](#连锁effect)

<!-- /TOC -->

<br>

## ✨Features

* Manage reducers and effects in the form of models, and make the code easier to organize by splitting the model.
* There is only 1 API. Just know the basic structure of the model, familiar with redux and Promise/async can get started quickly.

<br>

<br>

## 📦Installation

```
npm install @lxjx/redux-reduce
// or
yarn add @lxjx/redux-reduce
```

<br>

<br>

##  📺guide

**1. create model**  

The models are put together here for demonstration purposes. In actual projects, they are often placed in different files. For complex models, in order to prevent the model files from being too bloated, you need to create a directory for each model to store various types. Different duties effect and reducer.

```js
// models.js
// For example
const delay = ms => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export const user = {
  // Namespace, if not present, take the user above ↑
  namespace: 'user'
  // The initial state of the model
  state: {
    name: 'lxj',
    age: 18,
  },
  // reducer
  reducers: {
  	setName(state, action) {	// => { type: 'user/setName' }
  		// No need to use switch or any process statement, all reducers are precisely matched
  		return {...state, age: action.name || state.name}
  	}
  },
};

export const list = {
  namespace: 'list',
  state: {
    list: [],
  },
  reducers: {
  	// Each model is internally provided with a reducer defined as { type: user/setState, ...payload }. Note that this is an anti-pattern behavior, but in some cases you may Used.
    // setState(state, { type, ...action }) {
    //   return { ...state, ...action };
    // },
  },
  effects: {
    async fetchList(action, { dispatch, getState }) {
      await delay(1500);	// Delay 1.5s to perform the following operations
      dispatch({
        type: 'list/setName',
        list: [1, 2, 3]
      });
        
      // When you need to return something for the dispatch, receive it via dispatch().then(res => /*...*/) , even if it doesn't return, it will trigger then after receiving.
      return 'fetchList end';
    },
  },
};
```

**2. create store**

```js
// configStore.js
import createStoreEnhancer from '@lxjx/redux-reduce';
import * as models from './order/models';	// This syntax is used to import the model just created.
import { order } from './order/order'	// Import other models

// Merge all models
const rootModels = {
    ...models,
    order,
}

// create store
const store = createStoreEnhancer(models);

export default store;
```

**3. dispatch**

```js
// action
dispatch({
   type: 'user/setName',
   name: 'jxl'
});

// effect
dispatch({
   type: 'user/fetchList' 
}, 'effect') // Although this is not necessary, but for the sake of clarity, please pass 'effect' as the identifier for the second parameter.
  .then(res => {
    console.log(res)	// 'fetchList end'
  });
```

**4. According to your environment**  

* If you use Vanilla.js, import the above store and use it where you need it.
* With react, you also need an extra configuration to enable react-redux

```js
import { Provider } from 'react-redux'
import store from './store/configStore.js'

//...
<Provider store={store}>
    <App />
</Provider>
//...
```

<br>

<br>

## 📙API

### `createStoreEnhancer`  

createStoreEnhancer(models: object, initState?: object, enhancer[]?): store  

`models`:  All objects made up of model that need to be registered

`initState`：The initial state, by default will use the state declared in the model as the initial state of the model, you can also register the entire state tree through this property when registering the store (priority is higher than model.state, once declared, you must ensure that the declared state is overwritten Every model) is generally used to persist state.

`enhancer`: An array of middleware and store enhancer (no need to use compose), which is the only difference from the original createStore.

`store`: Complete unmodified redux store object

<br>

<br>

## other

### `Replace the root state`  

```js
dispatch({
    type: 'ReplaceRootState',
    user: {...},
    list: {...},
})
```

<br>

### `setState`

Each model contains a default reducer that simplifies partial reducer declarations and can be overridden by declaring a reducer of the same name

```js
dispatch({
    type: 'user/setState',
    name: '123'
})
           
dispatch({
    type: 'list/setState',
    list: [1, 2, 3, 4]
})
```
<br>

### `devtool`  
The redux devtool plugin is enabled by default in dev mode, just install it in your browser.

<br>

### `连锁effect`  

Each effect is an async function, so you can use them in any combination.

```js
  effects: {
    async changeList(action, { dispatch, getState }) {
      console.log(1);

      await delay(1500);
      
      console.log(2);

      dispatch({
        type: 'userInfo/setState',
        name: 'hahaha'
      })

      console.log(3);

      await delay(1500);

      console.log(4);

      await dispatch({
        type: 'lists/changeList2',
      }, 'effect')

      console.log(5);

      return 'effect end';
    },
    async changeList2(action, { dispatch, getState }) {
      await delay(1500);

      dispatch({
        type: 'userInfo/setState',
        name: 'hehehe'
      })
    },
  },
      
/* 
    1
    // waiting 1.5s
    2
    3
    // waiting 1.5s
    4
    
    -> lists/changeList2
    // waiting 1.5s
    5
    effect end
*/
```











