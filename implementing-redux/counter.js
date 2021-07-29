import Dedux from './dedux.js'
const { createStore, applyMiddleware } = Dedux


    const reducer = (previousState = {count: 0}, action = {type: 'INIT'}) => {
        switch (action.type) {
            case 'INCREMENT':
                return {
                    count: previousState.count + 1,
                };
            case 'DECREMENT':
                return {
                    count: previousState.count - 1,
                };
            case 'RESET': 
                return {
                    count: previousState.count = 0, 
                }; 
            default:
                return previousState;
        }
    };

    // Creates a dedux store
    const store = createStore(reducer); 

    // create and apply middleWare
    const logging = store => next => action => {
        console.log("Logging action here: ", action.type); 
        next(action); 
    }

    const localStorageMiddleware = store => next => action => {
        next(action);   //reducer needs to run before we check local
        store.state = checkLocalStorage(store.state, action); 
    }
    
    applyMiddleware(store, [logging, localStorageMiddleware]); 

    // Run this to initialize the state 
    store.dispatch({
        type: 'INIT' 
    }); 

    // listen for state change. update HTML when changed; initalize value as well
    const counter = document.getElementById('count');
    counter.innerHTML = store.getState().count
    store.subscribe(() => {
        counter.innerHTML = store.getState().count;
    });

    // Dispatch increment
    document.getElementById('up').addEventListener('click', () => {
        store.dispatch({
            type: 'INCREMENT'
        });
    });
    
    // Dispatch decrement
    document.getElementById('down').addEventListener('click', () => {
        store.dispatch({
            type: 'DECREMENT'
        });
    });

    // Dispatch reset
    document.getElementById('reset').addEventListener('click', () => {
        store.dispatch({
            type: 'RESET'
        });
    });

    //helper function for reducer
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
