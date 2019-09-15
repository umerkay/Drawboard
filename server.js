//aliases
const log = console.log;
//#region main
const express = require('express');
const path = require('path');
const app = express();
const config = require('config');

const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000; //setting port..
const server = app.listen(PORT, () => console.log('Serving on port ' + PORT));
const io = require('socket.io')(server);

const uuid = require('uuid/v4');

app.use(express.json()); //middleware for parsing incoming data..
app.use(express.urlencoded({ extended: false }));

io
	.use((socket, next) => {
		try {
			socket.decoded = jwt.verify(socket.handshake.query.token, config.get('jwtSecret'));
			next();
		}
		catch (err) {
			next(new Error('The authorisation token provided to the server was not valid: Could not authorize'));
		}
	})
	.on('connection', async socket => {

		const roomID = 'board?id=' + socket.decoded.id;
		socket.join(roomID);

		const board = await Board.findById(socket.decoded.id);
		if (!board)
			return io.emit('error', {
				msg: 'Oops.. An unexpected error occured. Try reloading',
				status: '500'
			});
		io.to(socket.id).emit('online', board.paths);

		io.to(roomID).emit('message', createMessage(socket, 'joined the chat', 'JOIN'));

		socket.on('message', ({ msg }) => {
			io.to(roomID).emit('message', createMessage(socket, msg.body));
		});

		socket.on('disconnect', () => {
			io.to(roomID).emit('message', createMessage(socket, 'left the chat', 'LEAVE'));
		});

		socket.on('typing', ({ type }) => {
			socket.broadcast.to(roomID).emit('typing', type, socket.handshake.query.name || socket.id);
		});

		socket.on('createBuffer', data => {
			io.to(roomID).emit('createBuffer', socket.id, data);
		});

		socket.on('appendBuffer', (x, y) => {
			io.to(roomID).emit('appendBuffer', socket.id, x, y);
		});

		socket.on('push', async path => {
			try {
				path.id = uuid();
				const pathEncoded = JSON.stringify(path);
				io.to(roomID).emit('push', socket.id, pathEncoded);
				await Board.findOneAndUpdate({ _id: socket.decoded.id }, { $push: { paths: pathEncoded } }, { useFindAndModify: false });
			} catch (err) {
				io.to(socket.id).emit('error', {
					msg: 'Oops.. An unexpected error occured. Try reloading',
					status: '500'
				});
			}
		});
	});

function createMessage(socket, body, type = 'MSG') {
	return {
		msg: {
			sender: {
				name: socket.handshake.query.name,
				id: socket.id
			},
			body,
			type
		}
	}
}

//#region mongoose mongodb
const mongoose = require('mongoose');
mongoose.connect(config.get('mongoURI'), { useNewUrlParser: true, useCreateIndex: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch(log);
//#endregion

app.use('/api/boards', require('./routes/api/boards'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));

// set static folder
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}