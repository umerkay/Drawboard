import { combineReducers } from 'redux';
import boardReducer from './boardReducer';
import authReducer from './authReducer';

export default combineReducers({
    board: boardReducer,
    auth: authReducer
});