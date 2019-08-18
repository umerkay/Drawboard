import React, { Component } from 'react'

export class Board extends Component {

    componentDidMount() {
        this.props.loadBoard(this.props.boardID); //authenticates if user is allowed to view board
        // this.props.loadBoard(this.props.boardID); //otherwise takes a password as parameter and tries to authenitcate with password
        //above is sent when user enters a password
    }

    onDeleteClick = id => {
        if (prompt("Are you sure you wish to delete this drawboard? This cannot be undone!"))
            this.props.deleteItem(id);
    };

    static propTypes = {
        loadBoard: PropTypes.func.isRequired,
        board: PropTypes.object.isRequired,
        boardAccess: PropTypes.bool,
        isLoading: PropTypes.bool
    };

    render() {
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    board: state.board.current,
    boardAccess: state.board.isAuthenticated,
    isLoading: state.board.isLoading
});

export default connect(
    mapStateToProps,
    { loadBoard, deleteBoard }
)(Board);
