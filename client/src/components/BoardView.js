import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getOneBoard, authorizeCurrent, clearErrors } from '../actions/boardActions';
import { loadUser } from '../actions/authActions';
import { Loading, Spacer } from './utilities';
import LeftBar from './LeftBar';
import './BoardView.css';
import { emojify } from 'react-emojione';

import { Sketch, Vector } from './Needless';

import socketIOClient from 'socket.io-client';
var socket;

class Path {
	constructor({ vertices = [], ...ctxState }) {
		this.ctxState = ctxState;
		this.vertices = vertices;
	}

	add(point) {
		this.vertices.push(point)
	}

	get() {
		return this.vertices;
	}

	render(sketch) {
		this.prepCtx(sketch.ctx());
		sketch.stroke(this.ctxState.strokeStyle);
		sketch.drawPoints(this.get());
	}

	prepCtx(ctx) {
		Object.assign(ctx, this.ctxState);
	}

	static stringify(obj) {
		return JSON.stringify(obj);
	}

	static parse(array) {
		try {
			return array.map(path => {
				const obj = JSON.parse(path);
				// console.log(new Path({ vertices: obj.vertices, ...obj.ctxState }));
				return new Path({ vertices: obj.vertices, ...obj.ctxState });
			});
		} catch (err) {
			console.log(err);
			return []
		}
	}

	static parseOne(path) {
		try {
			const obj = JSON.parse(path);
			return new Path({ vertices: obj.vertices, ...obj.ctxState });
		} catch (err) {
			console.log(err);
			return []
		}
	}
}

export class BoardView extends Component {

	state = {
		form: {},
		messages: [],
		endpoint: window.location.hostname,// + ':5000',
		showChat: true,
		unread: 0,
		connectionError: false,
		isConnected: false,

		tool: 'pencil'
	}

	color = { r: 0, g: 0, b: 0, a: 1 };
	colorChange = (color) => {
		this.color = color;
	}

	width = 2;
	widthChange = (width) => {
		this.width = width;
		this.reRender = true;
	}

	scale = 1;
	scaleChange = (scale) => {
		this.scale = scale;
		this.reRender = true;
	}

	setTool = (tool) => {
		this.setState({ tool });
	}


	componentWillUnmount() {
		if (socket) {
			socket.disconnect();
		}
	}

	async componentDidMount() {
		this.props.clearErrors();
		if (this.props.token && !this.props.isAuthenticated)
			await this.props.loadUser(false);
		await this.props.getOneBoard(this.props.match.params.id);

		this.connectToBoardRoom();
	}

	connectToBoardRoom() {
		if (this.props.boardToken) {
			socket = socketIOClient(this.state.endpoint, {
				query: {
					token: this.props.boardToken,
					name: this.props.name || ''
				}
			});
			socket.on('message', this.getMessage);
			socket.on('error', err => {
				this.setState({ connectionError: err, isConnected: false });
			});
			socket.on('online', paths => {
				this.paths = paths;
				this.setState({ isConnected: true, connectionError: false });
			});
		}
	}

	authorize = async e => {
		e.preventDefault();
		this.setState({ form: {} });
		this.props.clearErrors();
		await this.props.authorizeCurrent(this.state.form.password);

		this.connectToBoardRoom();
	}

	onChange = e => {
		this.setState({ form: { ...this.state.form, [e.target.name]: e.target.value } })
	}

	getMessage = ({ msg }) => {
		if (this.state.showChat === false) this.setState({ unread: this.state.unread + 1 });
		this.setState({ messages: [...this.state.messages, msg] })
	}

	sendMessage = (e, text) => {
		e.preventDefault();
		this.setState({ form: {} });
		socket.emit('message', { msg: { body: emojify(text, { output: 'unicode' }) } });
	}

	toggleChat = () => {
		this.setState({ showChat: !this.state.showChat, unread: 0 });
	}

	init = ({ background, setLayer, ctx, that, width, height }) => {
		const sketch = this.sketch = that();
		setLayer(0);
		this.background = this.props.board.background;
		background(this.background);
		ctx().lineCap = 'round';

		sketch.paths = Path.parse(this.paths);
		sketch.paths.forEach(path => path.render(sketch));

		setLayer(1);
		ctx().lineCap = 'round';

		sketch.pathBuffer = {};

		socket.on('createBuffer', (sender, data) => {
			if (sender !== socket.id) {
				sketch.pathBuffer[sender] = new Path({ ...data });
			}
		});

		socket.on('appendBuffer', (sender, x, y) => {
			if (sender !== socket.id) {
				sketch.pathBuffer[sender].add([x, y]);
			}
		});

		socket.on('push', (sender, path) => {
			if (sender !== socket.id) {
				delete sketch.pathBuffer[sender];
				// sketch.setLayer(0);
				const pathParsed = Path.parseOne(path);
				this.reRender = true;
				// pathParsed.render(sketch);
				sketch.paths.push(pathParsed);
			}
		});
		this.offset = new Vector(0, 0);
	}

	loop = ({ background, that, setLayer, clear, scale, translate, fill, rect }) => {
		const sketch = that();
		if (this.reRender) {
			setLayer(0);
			clear(0);
			background(this.background);
			translate(this.offset.x, this.offset.y);

			translate(sketch.width / 2 - this.offset.x, sketch.height / 2 - this.offset.y);
			scale(this.scale);
			translate(-sketch.width / 2 + this.offset.x, -sketch.height / 2 + this.offset.y);
			sketch.paths.forEach(path => path.render(sketch));
			this.reRender = false;
		}
		setLayer(1);
		clear();
		translate(this.offset.x, this.offset.y);

		translate(sketch.width / 2 - this.offset.x, sketch.height / 2 - this.offset.y);
		scale(this.scale);
		translate(-sketch.width / 2 + this.offset.x, -sketch.height / 2 + this.offset.y);
		for (let key in sketch.pathBuffer) {
			// if (key === socket.id) continue;
			sketch.pathBuffer[key].render(sketch);
		}
	}

	events = {
		'touchstart': ({ that, mouse }) => {
			const data = {
				vertices: [],
				lineWidth: this.width,
				strokeStyle: this.color,
			};
			that().pathBuffer[socket.id] = new Path(data);
			socket.emit('createBuffer', data);
		},
		'mousedown': ({ that, mouse, width, height }) => {
			if (this.state.tool !== 'pencil') return;
			const data = {
				// vertices: [mouse.position.array()],
				vertices: [calcBoardPosition(Vector.sub(mouse.position, Vector.mult(this.offset, this.scale)), width / 2, height / 2, this.scale)],
				lineWidth: this.width,
				strokeStyle: this.color,
			};
			that().pathBuffer[socket.id] = new Path(data);
			socket.emit('createBuffer', data);
		},
		'mousemove': ({ that, fill, setLayer, clear, mouse, pathBuffer, noStroke, circle, ctx, width, height }) => {
			if (mouse.isDown()) {
				if (this.state.tool === 'pencil') {
					// setLayer(1);
					// clear();
					// fill(this.color);
					const [x, y] = calcBoardPosition(Vector.sub(mouse.position, Vector.mult(this.offset, this.scale)), width / 2, height / 2, this.scale);
					pathBuffer[socket.id].add([x, y]);
					socket.emit('appendBuffer', x, y);
					// pathBuffer[socket.id].render(that());
					// noStroke();
					// circle(mouse.position.x, mouse.position.y, ctx().lineWidth / 2);
				} else {
					this.offset.add(Vector.sub(mouse.position, mouse.lastPosition).div(this.scale));
					this.reRender = true;
				}
			}
		},
		'mouseup': ({ that, setLayer, clear, paths, pathBuffer }) => {
			if (this.state.tool !== 'pencil') return;
			const sketch = that();
			setLayer(0);
			if (pathBuffer[socket.id] && pathBuffer[socket.id].get().length > 0) {
				// pathBuffer[socket.id].render(sketch);
				this.reRender = true;
				socket.emit('push', pathBuffer[socket.id]);
				sketch.paths.push(pathBuffer[socket.id]);
			}
			delete sketch.pathBuffer[socket.id];
			// setLayer(1);
			// clear();
		}
	}

	render() {
		const { isLoadingUser, isLoading, board, errors } = this.props;
		const { connectionError, isConnected } = this.state;

		if (isLoadingUser)
			return (
				<div className='flexbox cu uc fullvh'>
					<Loading msg='Authenticating'></Loading>
				</div>
			)
		if (isLoading)
			return (
				<div className='flexbox cu uc fullvh'>
					<Loading msg='Fetching DrawBoard'></Loading>
				</div>
			)
		if (!board || (board && !board.isAuthenticated))
			return (
				<div className='flexbox cu uc fullvh vertical p2'>
					{
						errors && errors.length > 0 ?
							<div className='error'>{errors.map(({ status, msg }, i) => (<p key={i}>{'Error ' + status + ': ' + msg}</p>))}</div> : null
					}
					{
						board ?
							<div>
								<Spacer></Spacer>
								<h2>{board.title}</h2>
								<h3>{board.owner ? <>Owned by {board.owner}</> : <>No Owner</>}</h3>
							</div> : null
					}
					{
						board && board.type === 'Password' ?
							<>
								<Spacer></Spacer>
								<form onSubmit={this.authorize} method="post" className="slidein flexbox uc cu vertical">
									<div>
										<input required onChange={this.onChange} type="password" placeholder='Password' name='password' />
										<input type="submit" value="Authorize" className='btn primary' />
									</div>
								</form>
							</> : null
					}
				</div>
			)
		if (!connectionError && !isConnected)
			return (
				<div className='flexbox cu uc fullvh'>
					<Loading msg='Connecting'></Loading>
				</div>
			)
		return (
			<>
				<div className='flexbox fullvh fullWidth'>
					{
						isConnected ? <>
							<LeftBar inView={true} setTool={this.setTool} colorChange={this.colorChange} scaleChange={this.scaleChange} widthChange={this.widthChange} value={this.color} />
							<Sketch style={{ cursor: this.state.tool === 'pencil' ? 'crosshair' : 'grab' }} events={this.events} init={this.init} loop={this.loop} width={'inherit'} height={'inherit'} layers={2}></Sketch>
						</> : connectionError ?
								<div className='flexbox cu uc full fullWidth vertical p2'>
									<p className='error'>{'Error ' + connectionError.status + ': ' + connectionError.msg}</p>
								</div>
								: null
					}
				</div>
				<MessageHead title={this.props.title} messages={this.state.messages} onSubmit={this.sendMessage.bind(this)} toggleChat={this.toggleChat.bind(this)} showChat={this.state.showChat} unread={this.state.unread}></MessageHead>
			</>
		)
	}
}

function calcBoardPosition({ x, y }, dx, dy, scale) {
	// console.log(x, y, dx, dy, scale);
	x = (x - dx) / scale + dx;
	y = (y - dy) / scale + dy;
	return [x, y];
}

export class MessageHead extends Component {

	state = {
		showChat: true,
		typing: []
	}

	typingTimer = null;

	componentDidMount() {
		socket.on('typing', (type, name) => {
			// console.log(type);
			if (type === 'START')
				this.setState({ typing: [name, ...this.state.typing] });
			else if (type === 'END')
				this.setState({ typing: [...this.state.typing.filter(el => el !== name)] });
		});
	}

	onSubmit = e => {
		this.typingEnd();
		clearTimeout(this.typingTimer);
		this.props.onSubmit(e, this.messageBody.value);
		this.messageBody.value = '';
	}

	componentDidUpdate() {
		if (this.messagesContainer instanceof Element)
			this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
	}

	onKeyUp = e => {
		clearTimeout(this.typingTimer);
		if (e.target.value) {
			if (!this.typingTimer)
				socket.emit('typing', { type: 'START' });
			this.typingTimer = setTimeout(this.typingEnd, 3000);
		}
	}

	typingEnd = () => {
		this.typingTimer = null;
		socket.emit('typing', { type: 'END' });
	}

	render() {
		const title = this.props.title + (this.props.unread ? ' (' + this.props.unread + ')' : '');
		return (
			<div className='messageHead'>
				<div className={"primary title" + (this.props.unread ? ' unread' : '')} onClick={this.props.toggleChat}>{title}</div>
				{this.props.showChat ?
					<div className='inner'>
						<div className="messages" ref={el => this.messagesContainer = el}>
							{
								this.props.messages.map((message, i) => {
									return (
										<div className="messageContainer" key={i}>
											{
												(message.sender.id !== socket.id) ?
													<span className={'message ' + message.type} >
														<span className="sender">{message.sender.name || message.sender.id}</span>
														<span className="body">{message.body}</span>
													</span>
													:
													<span className={'message ' + message.type + ' self'} >{message.body}</span>
											}
										</div>
									)
								})
							}
							{
								this.state.typing.map((name, i) => (
									<div className="messageContainer" key={i}>
										{
											<span className={'message typing'} >
												<span className="sender">{name}</span>
												<span className="body">typing..</span>
											</span>
										}
									</div>
								))
							}
						</div>
						<form onSubmit={this.onSubmit} method="post" id='sendForm' className="flexbox dark">
							<input onKeyUp={this.onKeyUp} ref={el => this.messageBody = el} required onChange={this.onChange} type="text" placeholder='Message' className='' style={{ flex: 9 }} />
							<button type="submit" value="Send" className='send' style={{ flex: 1 }}>
								<i className="fas fa-paper-plane fa-2x"></i>
							</button>
						</form>
					</div>
					: null}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	board: state.board.current,
	errors: state.board.errors,
	isLoading: state.board.isLoading,
	boardToken: state.board.token,
	title: state.board.current && state.board.current.title,

	token: state.auth.token,
	isAuthenticated: state.auth.isAuthenticated,
	isLoadingUser: state.auth.isLoading,
	name: state.auth.user && state.auth.user.name
});

export default connect(mapStateToProps, { getOneBoard, authorizeCurrent, clearErrors, loadUser })(BoardView)
