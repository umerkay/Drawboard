import React, { Component } from 'react';
import Cover from './Cover';
import CreateBoardModal from './CreateBoardModal';
import AuthForm from './AuthForm';
import LeftBar from './LeftBar';
import BoardsList from './BoardsList';
import { Spacer, Loading } from './utilities';

import { connect } from 'react-redux';

import { logout, loadUser } from '../actions/authActions';
import { getBoards } from '../actions/boardActions';

export class Home extends Component {

	state = {
		createBoardModal: false
	}

	toggleCreateBoard = () => {
		this.setState({ createBoardModal: !this.state.createBoardModal });
	}

	async componentDidMount () {
		if (this.props.token && !this.props.authenticated)
			await this.props.loadUser(false);
		if (this.props.authenticated) {
			await this.props.getBoards();
		}
	}

	render() {
		const { authenticated, token, isLoading, name, board } = this.props;
		if (authenticated === null && isLoading && token) {
			return (<div className='flexbox uc cu fullvh fullWidth'><Loading msg='Authenticating'></Loading></div>)
		} else if (!authenticated) {
			return (
				<div>
					<CreateBoardModal doRender={this.state.createBoardModal} toggle={this.toggleCreateBoard.bind(this)} authenticated={authenticated}></CreateBoardModal>

					<div style={{ height: '100vh' }} className='flexbox'>
						<Cover style={{ flex: 1.5 }}></Cover>
						<AuthForm style={{ flex: 1 }} toggleCreateBoard={this.toggleCreateBoard.bind(this)}></AuthForm>
					</div >
				</div>
			)
		} else if (authenticated === true) {
			return (
				<div>
					<CreateBoardModal doRender={this.state.createBoardModal} toggle={this.toggleCreateBoard.bind(this)} authenticated={authenticated}></CreateBoardModal>
					<div className='flexbox fullvh'>
						<LeftBar toggleCreateBoard={this.toggleCreateBoard.bind(this)}></LeftBar>

						<div className='p2 fullWidth' style={{ minWidth: 0, height: '100vh' }}>
							<h2>Hello {name}</h2>
							<Spacer height='2rem'></Spacer>

							<h2 style={{ height: '50px' }}>{board.isLoading ? <Loading></Loading> : 'Your DrawBoards'}</h2>
							<BoardsList isLoading={board.isLoading && board.boards && board.boards.length === 0} list={board.boards}></BoardsList>
							{
								board.isLoading === false && board.boards.length === 0 ? <span>You do not have any boards ;(</span> : null
							}
							{/* 
                        <Spacer></Spacer>

                        <h2>Bookmarked DrawBoards</h2>
                        <BoardsList list={''}></BoardsList> */}
						</div>
					</div>
				</div>
			)
		} else {
			return (<div></div>)
		}
	}
}

const mapStateToProps = state => ({
	authenticated: state.auth.isAuthenticated,
	isLoading: state.auth.isLoading,
	token: state.auth.token,

	name: state.auth.user ? state.auth.user.name : null,

	board: {
		isLoading: state.board.isLoading,
		boards: state.board.boards
	}
});

export default connect(mapStateToProps, { logout, loadUser, getBoards })(Home);
