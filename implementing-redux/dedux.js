export default {
  createStore,
  applyMiddleware,
}

function createStore (reducer, initialState) {

  const store = {
    state: initialState,
    listeners: [], 
    getState: () => store.state, 
    subscribe: (listener) => {
      store.listeners.push(listener); 
    }, 
    dispatch: (action) => {
      // store.state = applyMiddleware(store.state, action); 
      store.state = reducer(store.state, action); 
      store.listeners.forEach((listener) => listener()); 
    }
  }; 
  
  applyMiddleware(store.count); 
  return store;
}

function applyMiddleware(previousState, action) {

  return checkLocalStorage(previousState, action); 

}

function checkLocalStorage(previousState, action) {
  if(localStorage.getItem("count" === null)) {
    localStorage.setItem("count", count)
    return previousState
  }
  
  return localStorage.getItem("count"); 
}


