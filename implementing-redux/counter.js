import Dedux from './dedux.js'
const { createStore } = Dedux


    const initialState = {
        count: 0
    }

    document.getElementById('count').innerHTML = initialState.count

    const reducer = (previousState, action) => {
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
    const store = createStore(reducer, initialState); 

    // listen for state change. update HTML when changed
    const counter = document.getElementById('count');
    store.subscribe(() => {
        const state = store.getState();
        const count = state.count;
        counter.innerHTML = count;
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

    // Run this to initialize the state 
    store.dispatch({})