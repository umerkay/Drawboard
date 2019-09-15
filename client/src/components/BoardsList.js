import React, { Component } from 'react';
import './BoardsList.css';
import { connect } from 'react-redux';
import { deleteBoard } from '../actions/boardActions';
import { Link } from 'react-router-dom';

export class BoardsList extends Component {

    controls_delete = (id, title) => {
        if (window.confirm(`Are you sure you want to delete board '${title}'?`))
            this.props.deleteBoard(id)
    }

    render() {
        if (this.props.isLoading !== false) {

            const boards = [];
            for (let i = 0; i < 5; i++) {
                boards.push(
                    <div key={i} className='boardDisplayContainer'>
                        <div className='boardDisplay placeholder'>
                        </div>
                        <div className="title placeholder"></div>
                    </div>
                )
            }

            return (
                <div className='boardList'>
                    {boards}
                </div>
            )
        } else
            return (
                <div className='boardList'>
                    {
                        this.props.list.map(board => (
                            <div key={board._id || board.id || 0} className='boardDisplayContainer'>
                                {board._id || board.id ?
                                    <>
                                        <div className='boardDisplay' style={{ backgroundColor: board.background }}>
                                            <div className="boardControl">
                                                <button className='control danger' onClick={this.controls_delete.bind(this, board._id, board.title)}>
                                                    <i className="fas fa-trash-alt fa-1x"></i>
                                                </button>
                                                <Link to={'board/' + board._id} className='control flexbox uc cu'>
                                                    <i className="fas fa-pencil-alt fa-1x"></i>
                                                </Link>
                                                <button className='control dormant'>
                                                    <i className={board.type === 'Password' ? "fas fa-lock fa-1x" : "fas fa-lock-open fa-1x"}></i>
                                                </button>
                                                {/* <button className='control'></button> */}
                                            </div>
                                        </div>
                                        <div className="title">{board.title}</div>
                                    </>
                                    :
                                    <>
                                        <div className='boardDisplay placeholder'>
                                            {/* <div className="boardControl" /> */}
                                        </div>
                                        <div className="title placeholder" />
                                    </>
                                }
                            </div>
                        ))
                    }
                </div>
            )
    }
}

export default connect(null, { deleteBoard })(BoardsList)
