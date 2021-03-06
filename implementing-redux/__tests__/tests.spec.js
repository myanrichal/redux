import Dedux from '../dedux'
const { createStore, applyMiddleware } = Dedux

//jest doesn't play well 
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

const JSONMock = {
  parse: jest.fn(), 
  stringify: jest.fn()
}
global.JSON = JSONMock

/*======================================================
                          TESTS
======================================================*/
describe('dedux', () => {
  describe('createStore', () => {
    it('errors if no reducer function is passed in', () => {
      expect(() => createStore()).toThrow()
      expect(() => createStore({})).toThrow()
      expect(() => createStore('foo')).toThrow()
      expect(() => createStore(() => ({}))).not.toThrow()
    })
  })

  describe('the store', () => {
    describe('getState', () => {
      it(`returns the reducer's return value`, () => {
        const reducer = () => ({ foo: 'bar' })
        const store = createStore(reducer)
        expect(store.getState().foo).toBe('bar')
      })
    })

    describe('dispatch', () => {
      it('takes an action that conforms to { type: string, ...any }', () => {
        const store = createStore(() => {})

        expect(() => {
          store.dispatch({ randomKey: 'randomValue' })
        }).toThrow()

        expect(() => {
          store.dispatch({ type: 'TEST_ACTION', randomKey: 'randomValue' })
        }).not.toThrow()
      })

      it(`dispatch should take any dispatched action and run it 
          through the reducer function to produce a new state.`, () => {
        const reducer = (previousState = {foo: 'bar'}, action = {type: 'INIT'}) => {
          switch (action.type) {
            case 'BAZIFY':
                return {
                    foo: 'baz' 
                };
            default:
                return previousState;
          }
        } 

        const store = createStore(reducer)

        expect(store.getState().foo).toBe('bar')

        store.dispatch({ type: 'BAZIFY' })

        expect(store.getState().foo).toBe('baz')
      })
    })

    describe('subscribe', () => {
      it(`has a subscribe method that receives updates on any state change`, () => {
        const subscriber = jest.fn()
        const reducer = (state = 0, action = {}) => {
          switch (action.type) {
            case 'CALCULATE_MEANING_OF_LIFE':
              return 42
            default:
              return state
          }
        }

        const store = createStore(reducer)

        store.subscribe(subscriber)

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })

        expect(subscriber).toHaveBeenCalledWith(42)
      })

      it(`will return a function that allows you to unsubscribe`, () => {
        const subscriber = jest.fn()
        const reducer = (state = 0, action = {}) => {
          switch (action.type) {
            case 'CALCULATE_MEANING_OF_LIFE':
              return 42
            default:
              return state
          }
        }

        const store = createStore(reducer)

        const unsubscribe = store.subscribe(subscriber)

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })

        expect(subscriber).toHaveBeenCalledTimes(1)

        unsubscribe()

        store.dispatch({ type: 'CALCULATE_MEANING_OF_LIFE' })
        expect(subscriber).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('applyMiddleware', () => {
    // Don't start this until you've completed part 2 of the challenge
    it('can apply middleware to dispatched actions', () => {
      const reducer = () => null
      const spyA = jest.fn()
      const spyB = jest.fn()

      const middleWareMocker = spy => () => next => action => {
        spy(action)
        // Middleware must call 'next'
        next(action)
      }

      const store = createStore(reducer)

      applyMiddleware(store, [middleWareMocker(spyA), middleWareMocker(spyB)])

      const action = { type: 'ZAP' }

      store.dispatch(action)

      expect(spyA).toHaveBeenCalledWith(action)
      expect(spyB).toHaveBeenCalledWith(action)
    })
  })
})

describe('counter', () => {
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
  
  const store = createStore(reducer)

  it('increments when INCREMENT is dispatched', () => {
    store.dispatch({ type: 'INCREMENT' })
    expect(store.getState().count).toBe(1)
  })

  it('resets when RESET is dispatched', () => {
    store.dispatch({ type: 'RESET' })
    expect(store.getState().count).toBe(0)
  })

  it('decrements when DECREMENT is dispatched', () => {
    store.dispatch({ type: 'DECREMENT' })
    expect(store.getState().count).toBe(-1)
  })

})
