import { combineReducers } from 'redux';
import boardReducer from './boardReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    board: boardReducer,
    error: errorReducer,
    auth: authReducer
});