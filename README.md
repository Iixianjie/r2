<h1 align="center" style="color: #61dafb;">r2</h1>

<h1 align="center" style="font-size: 80px;color:#61dafb">🌼</h1>

<p align="center">r2(redux reduce): Model, async effect, ide and typescript friendly, without boilerplate code</p>

<br>

<p align="center">中文 | <a href="./README.en.md">English</a></p>

<br>
<!-- TOC -->

- [✨Features](#✨features)
- [🆚 string action 与 function action](#🆚-string-action-与-function-action)
- [📦Installation](#📦installation)
- [📺guide](#📺guide)
- [📙API](#📙api)
  - [createStoreEnhance](#createstoreenhance)
- [🌹其他](#🌹其他)
  - [替换整个state](#替换整个state)
  - [setState](#setstate)
  - [devtool](#devtool)
  - [连锁effect](#连锁effect)
- [额外的增强器和中间件](#额外的增强器和中间件)
  - [redux-cache](#redux-cache)

<!-- /TOC -->

<br>
## Features

* 类似vuex和dva、以model的形式管理reducer和effect，通过分割model来让代码更易组织和维护。
* 基于Promise/async function的effect处理。
* 用函数本身作为action name, 代替传统的字符串标识，即 `dispatch(model1.effect.getUserInfo)`  `{ type: 'action name' }`，对ide及定义跳转等功能更加友好且更易于维护。

<br>

<br>

## string action 与 function action

首先，我们来回顾一下vuex类似的库和原始redux的状态管理中，状态的声明以及更改过程。

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

创建action、reducer、creator的过程过于繁琐，在实际项目中，reducer会被拆分成很多不同的小模块，而action creator与reducer并不强关联，开发者在检索代码时会非常的头疼。

正是因为action creator与reducer不强关联, 想要查看`dispatch(incCount())`中incCount函数所指向的reducer时，只能使用目录搜索或是预先约定好的目录，这对ide的定义跳转以及typescript来说是非常致命的。



**vuex和dva类似的库:**

```js
// 以下为伪代码
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

聚合了state、reducers、effects，并且提供了model支持，相关代码集中存放，更易维护。但是dispatch的仍然是一个字符串，当想要在业务代码中查看`{ type: 'count/getCount' }`的定义时，依然无能为力，只能使用全文搜索或查看存放model的目录。



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

这里做了什么? 

无论是reducer还是effect，直接使用其函数定义来作为action发送，由于dispatch的就是处理函数本身，所以对跳转及类型等的支持都是纯天然的。

我们再回顾一下 `{ type: 'INCREMENT' }`这样的写法，其目的是触发一个以字符`'INCREMENT'`标识的唯一动作，而上面代码中的`count.reducers.inc`方法本身就包含一个唯一的内存地址, 其本身就可作为唯一的action, 并且在触发时`dispatch(count.reducers.getCount)`还带有`[namespace].[actionType].[handler]`这样的签名, 非常的直观以及方便。

<br>

<br>

## Installation

```
npm install @lxjx/r2
// or
yarn add @lxjx/r2
```

<br>

<br>

##  guide

**1. 创建model**  

这里将model放到一起只是为了演示，实际项目中往往会将它们放到不同的文件中，对于复杂的model， 为了防止model文件过于臃肿,  你需要为每个model建立一个目录来单独存放各种不同职责effect和reducer。

```js
// models.js
// 用于示例
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
      // 延迟1.5s执行后面的操作
      await delay(1500);	
      
      // 设置值
      dispatch(list.reducers.setList, [1, 2, 3]);
        
      // 通过dispatch().then(res => /*...*/)，可以接收fetchList的返回值
      return 'fetchList end';
    },
  },
};
```

**2. 创建store**

```js
// store.js
import createStoreEnhance from '@lxjx/r2';
import * as models from './order/models';	// 通过这种语法来导入刚才创建的model
import { order } from './order/order'	// 导入其他model

// 将所有model合并
const rootModels = {
    ...models,
    order,
}

// 创建store
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

使用react，你还需要额外的一点配置来启用react-redux

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

## API

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
  /** IModel接口实现组成的map对象 */
  models: {
    [namespace: string]: IModel<any>;
  };
  /** 初始状态，默认会使用model中声明的state作为该model的初始state，也可以在注册store时通过这个属性注册整个state树(优先级高于model.state, 一旦声明，必须保证声明的state覆盖到每一个model) */
  initState?: S;
  /** 与redux -> createStore()的enhancer相同 */
  enhancer?: StoreEnhancer<any, any>;
}
```

<br>

<br>

## 其他

### 替换整个state

内置`{ type: 'ReplaceRootState' }`, 可以使用它对根state进行替换

```js
dispatch({
    type: 'replaceRootState',
    user: {...},
    list: {...},
})
```

<br>

### setState

内置`{ type: 'setState/[namespace]' }`, 可以快捷的对某个model的state进行设置

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
在满足 `window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV === 'development'`时，会默认开启devtool的支持

<br>

### 连锁effect 

每个effect都是一个async函数，所以可以将它们任意的组合使用

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

<br >
<br >

## 额外的增强器和中间件
r2内置了一些常用的增强器和中间件，你可以在需要的时候引入它们并使用。
### redux-cache
```js
import { reduxCacheFactory } from '@lxjx/r2';

createStoreEnhance<AppState>({
  models: {
    user,
    home,
  },
  enhancer: reduxCacheFactory({ includes: ['user'] }), // 也可用于常规的createStore
});
```
interface
```js
interface ReduxCacheFactory {
  (options?: {
    /** 用于存储到sessionStorage的key */
    cacheKey?: string;
    /** 当此项长度大于0时，只会缓存该数组内指定的key */
    includes?: any[];
  }): StoreEnhancer;
}
```






