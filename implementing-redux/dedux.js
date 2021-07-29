export default {
  createStore,
  applyMiddleware,
  dumbMiddleware,
}


function createStore(reducer, initialState) {

  if( typeof reducer !== 'function' ){
    throw 'Create Store does not include valid Reducer'; 
  }

  const store = {
    state: initialState || reducer(),
    listeners: [], 
    reducer: reducer, 
    getState: () => store.state, 
    subscribe: (listener) => {
      let index = store.listeners.push(listener); 
      return () => {
        //unsubscribe
        store.listeners.splice(index-1, 1)
      }
    },
    dispatch: (action) => {
      if( action.hasOwnProperty('type') ) {
        store.state = reducer(store.state, action); 
        store.state = dumbMiddleware(store.state, action);  
        store.listeners.forEach((listener) => listener(store.state)); 
      } else {
        throw 'Action requires `type`'
      }
    }
  }; 

  return store;
}

function dumbMiddleware(state, action) {
  return checkLocalStorage(state, action); 
}

function applyMiddleware(store, middlewares) {

  const storeAPI = {
    getState: store.getState,
    dispatch: (action) => store.dispatch(action)
  }

  let coreDispatch = (action) => { 
    if( action.hasOwnProperty('type') ) {
      store.state = store.reducer(store.state, action); 
      store.listeners.forEach((listener) => listener(store.state)); 
    } else {
      throw 'Action requires `type`'
    }
  }

  let chain = []

    for(let i = middlewares.length-1; i > -1; i--) {
      if(i === middlewares.length-1) {
        //first in the loop; last in the chain call coreDispatch
        chain.push( middlewares[i](storeAPI)(coreDispatch) )   //chain[0]
      }
      else { 
        chain.push( middlewares[i](storeAPI)(chain[chain.length-1]) )
      } 
    }

    store.dispatch = (action) => middlewares[0](storeAPI)(chain[chain.length-1](action) )

  }


function checkLocalStorage(state, action) {
  let key = 'store'
  if(action.type === 'INIT') {
    if(localStorage.getItem(key) !== null) {
      state = JSON.parse( localStorage.getItem(key) ); 
    }
  } else {
    localStorage.setItem(key, JSON.stringify(state) ); 
  }
  return state
}
