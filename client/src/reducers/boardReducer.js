import { GET_ONE_BOARD_ERROR, GET_ONE_BOARD, ONE_BOARD_LOADING, GET_BOARDS, ADD_BOARD, DELETE_BOARD, BOARDS_LOADING, CLEAR_BOARDS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
    boards: [],
    isLoading: false,
    current: null,
    errors: [],
    token: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CLEAR_ERRORS:
            return {
                ...state,
                errors: []
            }
        case GET_ONE_BOARD_ERROR:
            return {
                ...state,
                errors: [...state.errors, ...action.payload.errors],
                isLoading: false
            }
        case GET_ONE_BOARD:
            return {
                ...state,
                isLoading: false,
                current: action.payload.board,
                token: action.payload.token
            };
        case GET_BOARDS:
            return {
                ...state,
                boards: action.payload.boards,
                isLoading: false
            };
        case CLEAR_BOARDS:
            return {
                ...state,
                boards: []
            };
        case DELETE_BOARD:
            return {
                ...state,
                boards: state.boards.filter(item => item._id !== action.payload)
            }
        case ADD_BOARD:
            return {
                ...state,
                boards: [...state.boards, action.payload]
            }
        case BOARDS_LOADING:
        case ONE_BOARD_LOADING:
            return {
                ...state,
                isLoading: true
            }
        default:
            return state
    }
}

