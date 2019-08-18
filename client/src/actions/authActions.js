import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, CLEAR_ERRORS } from './types';
import { getBoards, clearBoards } from './boardActions';

export const clearErrors = () => {
    return { type: CLEAR_ERRORS }
}

export const loadUser = (doLoadBoards) => async (dispatch, getState) => {
    dispatch(userLoading());

    const res = await fetch('/api/auth/user', tokenConfig(getState));
    const data = await res.json();

    if (!res.ok) return error(AUTH_ERROR, data, res, dispatch)
    else {
        ok(USER_LOADED, data, dispatch)
        if (doLoadBoards !== false)
            dispatch(getBoards());
    }
}

export const register = ({ name, email, password }) => async (dispatch, getState) => {
    dispatch(userLoading());

    const res = await fetch("/api/user", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) error(REGISTER_FAIL, data, res, dispatch)
    else {
        ok(REGISTER_SUCCESS, data, dispatch)
        dispatch(getBoards());
    }
}

export const login = ({ name, password }) => async dispatch => {
    dispatch(userLoading());

    const res = await fetch("/api/auth", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
    });
    const data = await res.json();

    if (!res.ok) return error(LOGIN_FAIL, data, res, dispatch)
    else {
        ok(LOGIN_SUCCESS, data, dispatch)
        dispatch(getBoards());
    }
}

export const logout = () => dispatch => {
    dispatch(clearBoards());
    dispatch({
        type: LOGOUT_SUCCESS
    });
};

export const userLoading = () => ({ type: USER_LOADING });

const error = (type, data, res, dispatch) => {
    let errors;
    if (data.msg instanceof Array) errors = data.msg.map(msg => ({ msg, status: res.status }))
    else errors = [{ msg: data.msg, status: res.status }]
    dispatch({
        type,
        payload: { errors }
    });
}

const ok = (type, data, dispatch) => {
    dispatch({
        type,
        payload: data
    });
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