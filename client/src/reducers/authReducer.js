import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, CLEAR_ERRORS } from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    errors: null,
    isLoading: false,
    user: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CLEAR_ERRORS:
            return {
                ...state,
                errors: null
            }
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
                errors: null
            };
        case USER_LOADED:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload.user,
                errors: null
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isLoading: false,
                isAuthenticated: true,
                errors: null
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                isLoading: false,
                errors: action.payload ? action.payload.errors : null
            }
        default:
            return state
    }
}