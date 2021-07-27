export default {
  createStore,
  applyMiddleware,
}


function createStore(reducer, initialState) {

  if( typeof reducer !== 'function' ){
    throw 'Create Store does not include valid Reducer'; 
  }

  const store = {
    state: initialState || reducer(),
    listeners: [], 
    getState: () => store.state, 
    subscribe: (listener) => {
      store.listeners.push(listener); 
    }, 
    dispatch: (action) => {
      if( action.hasOwnProperty('type') ) {
        store.state = reducer(store.state, action); 
        store.state = applyMiddleware(store.state, action);  
        store.listeners.forEach((listener) => listener()); 
      } else {
        throw 'Action requires `type`'
      }
    }
  }; 

  return store;
}

function applyMiddleware(state, action) {
  return checkLocalStorage(state, action); 
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
