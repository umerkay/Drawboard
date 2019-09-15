import { GET_ONE_BOARD_ERROR, GET_ONE_BOARD, ONE_BOARD_LOADING, GET_BOARDS, ADD_BOARD, BOARDS_LOADING, CLEAR_ERRORS, CLEAR_BOARDS } from "./types";

export const getBoards = () => async (dispatch, getState) => {
    dispatch(setBoardsLoading());

    const res = await fetch('/api/user/boards', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': getState().auth.token
        }
    });
    const data = await res.json();

    ok(GET_BOARDS, data, dispatch);
};

export const deleteBoard = id => async (dispatch, getState) => {
    // dispatch({
    //     type: DELETE_BOARD,
    //     payload: id
    // });
    dispatch({
        type: ONE_BOARD_LOADING,
        payload: id
    });

    const res = await fetch("/api/boards/" + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': getState().auth.token
        }
    });
    const data = await res.json();

    ok(GET_BOARDS, data, dispatch);
};

export const addBoard = board => async (dispatch, getState) => {
    if (getState().auth.isAuthenticated) {
        dispatch({
            type: ADD_BOARD,
            payload: board
        });

        const res = await fetch("/api/boards", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': getState().auth.token
            },
            body: JSON.stringify(board)
        });
        const data = await res.json();

        ok(GET_BOARDS, data, dispatch);
    } else {
        const res = await fetch("/api/boards/anonymous", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(board)
        });
        const data = await res.json();
        window.location.href += 'board/' + data.board._id;
    }
};

export const getOneBoard = id => async (dispatch, getState) => {
    dispatch({ type: ONE_BOARD_LOADING });
    const { auth } = getState();

    const res = await fetch("/api/boards/" + id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': auth.token || null
        }
    });
    const data = await res.json();

    if (!res.ok) error(GET_ONE_BOARD_ERROR, data, res, dispatch);
    ok(GET_ONE_BOARD, data, dispatch);
};

export const authorizeCurrent = password => async (dispatch, getState) => {
    dispatch({
        type: ONE_BOARD_LOADING
    });

    const res = await fetch("/api/boards/auth/" + getState().board.current.id, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (!res.ok) error(GET_ONE_BOARD_ERROR, data, res, dispatch);
    ok(GET_ONE_BOARD, data, dispatch);
};

export const clearErrors = () => ({ type: CLEAR_ERRORS });
export const clearBoards = () => ({ type: CLEAR_BOARDS });
export const setBoardsLoading = () => ({ type: BOARDS_LOADING });

const ok = (type, data, dispatch) => {
    dispatch({
        type,
        payload: data
    });
}

const error = (type, data, res, dispatch) => {
    let errors;
    if (data.msg instanceof Array) errors = data.msg.map(msg => ({ msg, status: res.status }))
    else errors = [{ msg: data.msg, status: res.status }]
    dispatch({
        type,
        payload: { errors }
    });
}