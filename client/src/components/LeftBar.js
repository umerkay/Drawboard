import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './LeftBar.css';
import { Spacer } from './utilities';

import { logout } from '../actions/authActions';

import { connect } from 'react-redux';
// import { CirclePicker } from 'react-color';

export class LeftBar extends Component {

	controls_logout = () => {
		if (window.confirm('Are you sure you want to logout?'))
			this.props.logout()
	}

	render() {
		return (
			<div style={{ ...this.props.style }} id='leftBar' className='primary'>
				{
					this.props.isAuthenticated ?
						<>
							{/* <div className='pfp primaryFill'>{this.props.name[0].toUpperCase()}</div>
                        <Spacer></Spacer> */}

							{
								this.props.inView ?
									<Link to="/" className='toolbar'>
										<i className='fas fa-layer-group fa-1x'></i>
									</Link>
									:
									<>
										<button className='toolbar' onClick={this.props.toggleCreateBoard}>
											<i className='fas fa-plus fa-1x'></i>
										</button>
										<button className='toolbar' onClick={this.controls_logout.bind(this)}>
											<i className="fas fa-sign-out-alt fa-1x"></i>
										</button>
										{/* <button className='toolbar'>
											<i className="fas fa-user-alt fa-1x"></i>
										</button> */}
									</>
							}
						</> : null
				}

				{
					this.props.inView ?
						<>
							<Spacer></Spacer>
							<button className='toolbar'>
								<i className="fas fa-pencil-alt fa-1x"></i>
							</button>
							<div style={{ backgroundColor: this.state.color || this.props.value }} className='toolbar'>
								<input onChange={this.colorChange} value={this.props.value} type='color' style={{ opacity: 0, cursor: 'inherit', borderRadius: 'inherit' }} className='full fullWidth' />
							</div>
						</> : null
				}

			</div>
		)
	}

	state = {
		color: null
	}

	colorChange = (e) => {
		this.setState({ color: e.target.value });
		this.props.colorChange(e.target.value);
	}
}

const mapStateToProps = state => ({
	name: state.auth.user && state.auth.user.name,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(LeftBar);
