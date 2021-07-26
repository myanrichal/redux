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
      store.state = reducer(store.state, action); 
      store.state = applyMiddleware(store.state, action);  
      store.listeners.forEach((listener) => listener()); 
    }
  }; 

  return store;
}

function applyMiddleware(state, action) {
  return checkLocalStorage(state, action); 
}

function checkLocalStorage(state, action) {
  let localCount = "count"
  if(action.type === 'INIT') {
    if(localStorage.getItem(localCount) !== null) {
      state = { count: parseInt(localStorage.getItem(localCount)) }; 
    }
  } else {
    localStorage.setItem(localCount, state.count); 
  }
  return state
}



/*
 if(action.type === 'INIT' && (localStorage.getItem("count") !== null) ) {
    let initCount = localStorage.getItem("count")
    return { 
      count : initCount, 
    }; 
  }
  
  localStorage.setItem("count", state.count); 
  return state
  */

