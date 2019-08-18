import { GET_BOARDS, ADD_BOARD, DELETE_BOARD, BOARDS_LOADING } from "./types";
// import { tokenConfig } from './authActions';
import { returnErrors } from './errorsActions';

export const getBoards = (loadingAnim) => async (dispatch, getState) => {
    // if(loadingAnim != false) dispatch(setBoardsLoading());
    dispatch(setBoardsLoading());

    const config = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const token = getState().auth.token;
    if (token) config.headers['x-auth-token'] = token;

    const res = await fetch('/api/user/boards', config);
    const data = await res.json();

    if (!res.ok) {
        dispatch(returnErrors(data.msg || res.statusText, res.status));
        return;
    }

    dispatch({
        type: GET_BOARDS,
        payload: data
    })
};

export const clearBoards = () => ({
    type: 'CLEAR_BOARDS'
});

export const deleteBoard = id => async (dispatch, getState) => {

    //deleting board before checking server for authorisation
    //because board can only be deleted if token is available and valid
    //if however some hack is done, the server will not be updated even though client will
    //delete instantly
    dispatch({
        type: DELETE_BOARD,
        payload: id
    });

    const config = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const token = getState().auth.token;
    if (token) config.headers['x-auth-token'] = token;

    const res = await fetch("/api/boards/" + id, config);
    const data = await res.json();

    if (!res.ok) {
        dispatch(returnErrors(data.msg || res.statusText, res.status));
        // return;
    }

    dispatch(getBoards());
};

export const addBoard = board => async (dispatch, getState) => {
    
    const config = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(board)
    };
    const token = getState().auth.token;
    if (token) config.headers['x-auth-token'] = token;

    const res = await fetch("/api/boards", config);
    const data = await res.json();

    if (!res.ok) {
        dispatch(returnErrors(data.msg || res.statusText, res.status));
        // return;
    }

    // dispatch({
    //     type: ADD_BOARD,
    //     payload: board
    // });

    dispatch(getBoards(false));

};

export const setBoardsLoading = () => {
    return {
        type: BOARDS_LOADING
    };
};


// export const getBoards = () => dispatch => {
//     dispatch(setBoardsLoading());
//     fetch("/api/boards")
//         .then(statusCheck)
//         .then(res => res.json())
//         .then(data =>
//             dispatch({
//                 type: GET_BOARDS,
//                 payload: data
//             })
//         );
// };

    // fetch("/api/boards", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(board)
    // })
    //     .then(res => res.json())
    //     .then(data =>
    //         dispatch({
    //             type: ADD_BOARD,
    //             payload: data
    //         })
    //     );

// function statusCheck(res) {
//     if (!res.ok) console.error(new Error(res.statusText));
//     return res;
// }