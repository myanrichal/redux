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
        store.listeners.forEach((listener) => listener(store.state)); 
      } else {
        throw 'Action requires `type`'
      }
    }
  }; 

  return store;
}

function applyMiddleware(store, middlewares) {
  if(middlewares) {
    //define original dispatch
    let coreDispatch = (action) => { 
      if( action.hasOwnProperty('type') ) {
        store.state = store.reducer(store.state, action); 
        store.listeners.forEach((listener) => listener(store.state)); 
      } else {
        throw 'Action requires `type`'
      }
    }

    //build the chain! 
    let chain = []
    for(let i = middlewares.length-1; i > -1; i--) {
      if(i === middlewares.length-1) {
        //first in the loop; last in the chain call coreDispatch
        chain.push( middlewares[i](store)(coreDispatch) )   //chain[0]
      }
      else { 
        chain.push( middlewares[i](store)(chain[chain.length-1]) )
      } 
    }

    //new dispatch with middleware
    store.dispatch = (action) => middlewares[0](store)(chain[chain.length-1](action) )
  }
}

