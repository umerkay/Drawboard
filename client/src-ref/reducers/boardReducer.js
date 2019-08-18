import { GET_BOARDS, ADD_BOARD, DELETE_BOARD, BOARDS_LOADING, CLEAR_BOARDS } from '../actions/types';

const initialState = {
    boards: [],
    loading: false,
    current: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_BOARD:
            return {
                ...state,
                current: action.payload.board,
                loading: false
            };
        case GET_BOARDS:
            return {
                ...state,
                boards: action.payload,
                loading: false
            };
        case CLEAR_BOARDS:
            return {
                ...state,
                boards: []
            };
        case DELETE_BOARD:
            return {
                ...state,
                boards: state.boards.filter(item => item.id !== action.payload)
            }
        case ADD_BOARD:
            return {
                ...state,
                boards: [...state.boards, action.payload]
            }
        case BOARDS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
}

