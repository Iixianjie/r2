<h1 align="center" style="color: #61dafb;">r2</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">🌼</h1>

<p align="center">r2(redux reduce): Model, async effect, ide and typescript friendly, without boilerplate code</p>

<br>

<p align="center"><a href="./README.md">中文</a> | English</p>

<br>

## ✨Features

* similar to vuex and dva, managing reducers and effects in the form of models, and splitting models to make code easier to organize and maintain.

* effect processing based on Promise/async function.

* use the function itself as the action name instead of the traditional string identifier, `dispatch(model1.effect.getUserInfo)`  <=>  `{ type: 'action name' }`, which is more friendly and easier to use for ide and definition jumps.<br>

<br>

## 🆚 string action & function action

First, let's review the vuex-like library and the state management of the original redux, the state declaration and the change process.

**redux:**

```js
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const SETCOUNT = 'SETCOUNT';

// reducer
function count(count = 0, action) {
  if (action.count) {
      return action.count;
  }
    
  switch (action.type) {
    case 'INCREMENT':
      return count + 1
    case 'DECREMENT':
      return count - 1
    default:
      return count
  }
}

// action creator
const incCount = () => ({ type: INCREMENT })
const decCount = () => ({ type: INCREMENT })
const setCount = (count) => ({ type: SETCOUNT, count, })

// effect (use middleware)
async function fetchCount(dispatch) {
    const count = fetch('http://xx.cn/getCount');
    dispatch(setCount(count));
}

// trigger
dispatch(incCount());
dispatch(fetchCount);
```

The process of creating action, reducer, and creator is too cumbersome. In the actual project, the reducer will be split into many different small modules, and the action creator is not strongly associated with the reducer. The developer will have a headache when searching for code.

It is precisely because the action creator is not strongly associated with the reducer. When you want to view the reducer pointed to by the incCount function in dispatch(incCount()), you can only use the directory search or the pre-agreed directory, which defines the jump of ide and Typescript is very deadly.



**similar to vuex and dva::**

```js
// The following is a pseudo code
const count = {
    state: 0;
    reducers: {
    	inc(state) {
            return state + 1;
        },
        dec(state) {
            return state + 1;
        },
       	setCount(state, { count }) {
            return count;
        }
	},
    effects: {
        async getCount(action, { dispatch }) {
            const count = await fetch('http://xx.cn/getCount');
            dispatch({
                type: 'count/setCount',
                count,
            });
        }
    }
}

// trigger
dispatch({ type: 'count/inc' });
dispatch({ type: 'count/dec' });
dispatch({ type: 'count/getCount' });
```

Aggregates state, reducers, effects, and provides model support. The relevant code is stored centrally and is easier to maintain.

But the dispatch is still a string. When you want to see the definition of` { type: 'count/getCount' }` in the business code, you can't do anything. You can only use full-text search or view the directory where the model is stored.



**r2:**

```js
const count = {
    state: 0;
    reducers: {
    	inc(state) {
            return state + 1;
        },
        dec(state) {
            return state + 1;
        },
       	setCount(state, count) {
            return count;
        }
	},
    effects: {
        async getCount(action, { dispatch }) {
            const count = await fetch('http://xx.cn/getCount');
            dispatch(count.reducers.setCount, count);
        }
    }
}

// trigger
dispatch(count.reducers.inc);
dispatch(count.reducers.inc);
dispatch(count.reducers.getCount);
```

What did you do here?

Whether it is a reducer or an effect, directly use its function definition to send as an action. Since the dispatch is the processing function itself, support for jumps and types is purely natural.

Let's review the wording of `{ type: 'INCREMENT' }`, which is designed to trigger a unique action identified by the character 'INCREMENT', and the count.reducers.inc method in the above code itself contains a unique memory address.

It can be used as the only action itself, and the signature `dispatch(count.reducers.getCount)` also has a signature such as` [namespace].[actionType].[handler]` when triggered, which is very intuitive and convenient.

<br>

<br>

## 📦Installation

```
npm install @lxjx/r2
// or
yarn add @lxjx/r2
```

<br>

<br>

##  📺guide

**1. create model**  

The models are put together here for demonstration purposes. In actual projects, they are often placed in different files. For complex models, in order to prevent the model files from being too bloated, you need to create a directory for each model to store various types.

Different duties effect and reducer.

```js
// models.js
// For example
const delay = ms => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, ms);
});

export const user = {
  state: {
    name: 'lxj',
    age: 18,
  },
  reducers: {
  	setName(state, action) {
  		return {...state, ...action}
  	}
  },
};

export const list = {
  state: {
    list: [],
  },
  reducers: {
      setList(state, { list }) {
          reutnr { ...state, list };
      }
  },
  effects: {
    async fetchList(action, { dispatch, getState }) {
      // Delay 1.5 s to perform subsequent operations
      await delay(1500);	
      
      // set state
      dispatch(list.reducers.setList, [1, 2, 3]);
        
      // via dispatch().then(res => /*...*/)，Can receive the return value of fetchList
      return 'fetchList end';
    },
  },
};
```

**2. create store**

```js
// store.js
import createStoreEnhance from '@lxjx/r2';
import * as models from './order/models';
import { order } from './order/order'	// other model

// compose
const rootModels = {
    ...models,
    order,
}

// create store
const store = createStoreEnhance(rootModels);

export default store;
```

**3. dispatch**

```js
import { user } from './models';

// reducer
dispatch(user.reducer.setName, { name: 'xxx' });

// effect
dispatch(user.effects.fetchList)
  .then(res => {
    console.log(res)	// 'fetchList end'
  });
```

**4. 与react**

use with react-redux

```js
import { Provider } from 'react-redux'
import store from './store.js'

//...
<Provider store={store}>
    <App />
</Provider>
//...
```

<br>

<br>

## 📙API

### createStoreEnhance

```typescript
createStoreEnhance(options: CreateStoreEnhanceOptions);

interface IModel<T> {
  state: T;
  reducers: {
    [key: string]: ReducerFn<T>;
  }
  effects: {
    [key: string]: EffectFn<T>;
  }
}

export interface CreateStoreEnhanceOptions<S> {
  /** Map object composed of IModel interface implementation */
  models: {
    [namespace: string]: IModel<any>;
  };
  /** In the initial state, the state declared in model is used by default as the initial state, of the model, or the entire state tree can be registered through this property when registering store (priority is higher than model.state, once declared, you must ensure that the declared state covers every model) */
  initState?: S;
  /** Same as the enhancer of redux -> createStore() */
  enhancer?: StoreEnhancer<any, any>;
}
```

<br>

<br>

## 🌹other

### Replace the entire state

Built-in `{ type: 'ReplaceRootState' }`, you can use it to replace the root state

```js
dispatch({
    type: 'replaceRootState',
    user: {...},
    list: {...},
})
```

<br>

### setState

Built-in `{ type: 'setState/[namespace]' }`, you can quickly set the state of a model

```js
dispatch({
    type: 'setState/user',
    name: '123'
})
           
dispatch({
    type: 'setState/list',
    list: [1, 2, 3, 4]
})
```
<br>

### devtool
when `window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV === 'development'`, auto setup

<br>

### Continuous effect

Each effect is a async function, so you can use any combination of them

```js
effects: {
    async getUserInfo(action, { dispatch }) {
        console.log(1);

        await delay(1000);

        console.log(2);

        dispatch(m1.reducers.put, 'effect set');

        console.log(3);

        await delay(1000);

        console.log(4);

        await dispatch(m2.effects.getUserInfo2);

        console.log(6);

        return 7;
    },
    async getUserInfo2() {
        await delay(1000);
        console.log(5);
    },
}

// trigger
dispatch(xx.effects.getUserInfo)
	.then(res => console.log(res));      

/* 
    1
    // waiting 1s
    2
    
    3
    
    // waiting 1s
    4
    
    -> lists/changeList2
    
    // waiting 1s
    5
    
    6
    
    effect end
    
    7
*/
```











