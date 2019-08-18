import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL } from './types';
import { returnErrors } from './errorsActions';
import { getBoards, clearBoards } from './boardActions';

export const loadUser = () => async (dispatch, getState) => {
    dispatch(userLoading());

    const res = await fetch('/api/auth/user', tokenConfig(getState));

    const data = await res.json();

    if (!res.ok) {
        dispatch(returnErrors(data.msg || res.statusText, res.status));
        dispatch({
            type: AUTH_ERROR,
        });
        return;
    }

    dispatch({
        type: USER_LOADED,
        payload: data
    });

    dispatch(getBoards());

}

export const register = ({ name, email, password }) => async (dispatch, getState) => {

    const res = await fetch("/api/user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        dispatch(returnErrors(data.msg || res.statusText, res.status, 'REGISTER_FAIL'));
        dispatch({
            type: REGISTER_FAIL,
        });
        return;
    }

    dispatch({
        type: REGISTER_SUCCESS,
        payload: data
    });

    dispatch(getBoards());

}

export const login = ({ name, password }) => async dispatch => {
    const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password })
    });

    const data = await res.json();

    if (!res.ok) {
        dispatch(returnErrors(data.msg || res.statusText, res.status, 'LOGIN_FAIL'));
        dispatch({
            type: LOGIN_FAIL,
        });
        return;
    }

    dispatch({
        type: LOGIN_SUCCESS,
        payload: data
    });

    dispatch(getBoards());

}

export const logout = () => dispatch => {
    dispatch(clearBoards());
    dispatch({
        type: LOGOUT_SUCCESS
    });
};

export const userLoading = () => {
    return {
        type: USER_LOADING
    }
}

export const tokenConfig = getState => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const token = getState().auth.token;
    if (token) config.headers['x-auth-token'] = token;

    return config;
}