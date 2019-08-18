
// .on('connection', async socket => {

// 	const roomID = 'board?id=' + socket.decoded.id;
// 	socket.join(roomID);



// 	const OwnerOnline = io.sockets.adapter.rooms[roomID].isOwnerOnline;
// 	if (!OwnerOnline) {
// 		if (socket.decoded.role !== 'OWNER') {
// 			io.to(socket.id).emit('error', {
// 				msg: 'The owner of this drawboard is not currently online',
// 				status: 'offline'
// 			});
// 		} else if (socket.decoded.role === 'OWNER') {
// 			io.sockets.adapter.rooms[roomID].isOwnerOnline = true;
// 			io.sockets.adapter.rooms[roomID].owner = socket;

// 			const board = await Board.findById(socket.decoded.id).select('paths');
// 			io.to(roomID).emit('online', board.paths);

// 			io.to(socket.id).emit('host');
// 			io.to(roomID).emit('message', createMessage(socket, 'Now hosting the Drawboard', 'JOIN'));

// 			socket.on('save', async paths => {
// 				const boardB = await Board.findById(socket.decoded.id).select('paths');
// 				boardB.paths = paths;
// 				await boardB.save();
// 			});

// 			socket.on('disconnect', () => {

// 				io.to(roomID).emit('error', {
// 					msg: 'The owner of this drawboard has disconnected',
// 					status: 'offline'
// 				});

// 				if (io.sockets.adapter.rooms[roomID]) {
// 					io.sockets.adapter.rooms[roomID].isOwnerOnline = false;
// 					io.sockets.adapter.rooms[roomID].owner = null;
// 				}
// 			});
// 		}
// 	} else {
// 		io.to(socket.id).emit('online');
// 	}

// 	io.to(roomID).emit('message', createMessage(socket, 'joined the chat', 'JOIN'));

// 	socket.on('message', ({ msg }) => {
// 		io.to(roomID).emit('message', createMessage(socket, msg.body));
// 	});

// 	socket.on('disconnect', () => {
// 		io.to(roomID).emit('message', createMessage(socket, 'left the chat', 'LEAVE'));
// 	});
// });
