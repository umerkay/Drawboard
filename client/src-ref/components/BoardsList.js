import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button, Alert } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import { getBoards, deleteBoard } from "../actions/boardActions";
import PropTypes from "prop-types";
import Loading from './Loading';

export class BoardsList extends Component {
    // componentDidMount() {
    //     // if (this.props.isAuthenticated)
    //     //     this.props.getItems();
    // }

    onDeleteClick = id => {
        if (prompt("Are you sure you wish to delete this drawboard? This cannot be undone!"))
            this.props.deleteItem(id);
    };

    static propTypes = {
        getBoards: PropTypes.func.isRequired,
        board: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        isLoading: PropTypes.bool
    };

    render() {
        const { boards, loading } = this.props.board;
        if (this.props.isLoading) return (<Loading msg="Logging you in.." />)
        if (!this.props.isAuthenticated) return (<Alert color="info">Login to view your boards</Alert>)
        return (
            < Container >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1 style={{ display: "inline", marginRight: '1rem', marginBottom: '0rem' }}>Your Boards</h1>
                    {loading ? <Loading fill="inline" /> : null}
                </div>
                <ListGroup>
                    <TransitionGroup className="board-list">
                        {boards.map(({ id, title }) => (
                            <CSSTransition
                                key={id}
                                timeout={500}
                                classNames="fade"
                            >
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn mr-3"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(
                                            this,
                                            id
                                        )}
                                    >
                                        &times;
                                    </Button>

                                    {title}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
                {(boards.length === 0) ? <Alert color="info">You do not have any boards!</Alert> : null}
            </Container >
        );
    }
}

const mapStateToProps = state => ({
    board: state.board,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading
});

export default connect(
    mapStateToProps,
    { getBoards, deleteBoard }
)(BoardsList);
