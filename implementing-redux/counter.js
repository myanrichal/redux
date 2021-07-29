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
                }
            default:
                return previousState;
        }
    };

    // Creates a dedux store
    const store = createStore(reducer); 

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
    // document.getElementById('reset').addEventListener('click', () => {
    //     store.dispatch({
    //         type: 'RESET'
    //     });
    // });

    document.getElementById('reset').addEventListener('click', () => {
        const logging = storeAPI => next => action => {
            console.log("Logging action here: ", action.type); 
            next(action); 
            return "done";  
        }

        const blogging = function(storeAPI) {
            return function(next) {
                return function(action) {
                    console.log("blogging "); 
                    next(action); 
                    return "done"; 
                }
            }
        }

        const asdf = function(storeAPI) {
            return function(next) {
                return function(action) {
                    console.log("asdf "); 
                    next(action); 
                    return "done"; 
                }
            }
        }

        const frogging = function(storeAPI) {
            return function(next) {
                return function(action) {
                    console.log("ribbet "); 
                    next(action); 
                    return "whatever"; 
                }
            }
        }
        
        applyMiddleware(store, [logging, blogging, asdf, frogging]); 
    })

    // const logging = storeAPI => next => action {
    //     console.log("logging!"); 

    //   }