import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialStore = {};

const middleware = [thunk];

const composeEnhancers = window.REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(
    rootReducer,
    initialStore,
    enhancer
);

export default store;