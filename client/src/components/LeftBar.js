import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './LeftBar.css';
import { Spacer } from './utilities';

import { logout } from '../actions/authActions';

import { connect } from 'react-redux';
import { SketchPicker } from 'react-color';

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
							<button onClick={this.selectTool} className={this.state.tool !== 'pencil' ? 'toolbar unselected' : 'toolbar'} id='pencil'>
								<i className="fas fa-pencil-alt fa-1x" id='pencil'></i>
							</button>
							<button onClick={this.selectTool} className={this.state.tool !== 'hand' ? 'toolbar unselected' : 'toolbar'} id='hand'>
								<i className="fas fa-hand-paper fa-1x" id='hand'></i>
							</button>
							<div style={{ backgroundColor: this.state.color.hex || this.props.value }} className='toolbar colorpicker hoverer'>
								<SketchPicker className='hover' onChange={this.colorChange} color={this.state.color.rgb}>lol</SketchPicker>
								{/* <input onChange={this.colorChange} value={this.props.value} type='color' style={{ opacity: 0, cursor: 'inherit', borderRadius: 'inherit' }} className='full fullWidth' /> */}
							</div>
							<button className='toolbar hoverer'>
								<i className="fas fa-cog fa-1x"></i>
								<div className='hover widthpicker'>
									Width <input type="range" min='1' max='100' value={this.state.width} onChange={this.widthChange} />
									Scale <input type="range" min='0.1' max='3' step='0.01' value={this.state.scale} onChange={this.scaleChange} />
								</div>
							</button>
						</> : null
				}

			</div>
		)
	}

	state = {
		color: { rgb: { r: 0, g: 0, b: 0, a: 1 }, hex: '#000000' },
		width: 5,
		scale: 1,
		tool: 'pencil'
	}

	colorChange = (e) => {
		const color = e || e.target.value;
		this.setState({ color });
		this.props.colorChange(color.rgb);
	}

	selectTool = (e) => {
		this.setState({ tool: e.target.id });
		this.props.setTool(e.target.id);
	}

	widthChange = e => {
		this.setState({ width: e.target.value });
		this.props.widthChange(e.target.value);
	}

	scaleChange = e => {
		this.setState({ scale: e.target.value });
		this.props.scaleChange(e.target.value);
	}
}

const mapStateToProps = state => ({
	name: state.auth.user && state.auth.user.name,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(LeftBar);
