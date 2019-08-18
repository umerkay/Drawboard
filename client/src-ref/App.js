import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarHeader from './components/Navbar';
import BoardList from './components/BoardsList';
import { Provider } from 'react-redux';

import store from './store';
import BoardModal from './components/BoardModal';
import { Container } from 'reactstrap';

import { loadUser } from './actions/authActions';

export default class App extends React.Component {

	componentDidMount() {
		if (store.getState().auth.token) {
			store.dispatch(loadUser());
		}
	}

	render() {
		return (
			<Provider store={store}>
				<div className="App">
					<NavbarHeader />
					<Container>
						<BoardModal /> {/* Add Board, modal:CSS */}
						<BoardList /> {/* Boards Dashboard:List only */}
					</Container>
				</div>
			</Provider>
		);
	}
}