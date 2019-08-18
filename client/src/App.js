import React from 'react';

import './App.css';	
import './components/utilities.css';

import { Provider } from 'react-redux';
import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import BoardView from './components/BoardView';

export default class App extends React.Component {

	componentDidMount = () => {
		if (this.props.token)
			this.props.loadUser();
	}

	render() {
		return (
			<Router>
				<Provider store={store}>
					<div className="App">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/board/:id" component={BoardView} />
							<Route path="/" render={() => (
								<div className='flexbox uc cu fullvh'>Uh what? I think you shouldn't be here</div>
							)}></Route>
						</Switch>
					</div>
				</Provider>
			</Router>

		);
	}
}