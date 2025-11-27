// utils/socket.js
/* Socket.io initialization for realtime notifications */
let ioInstance = null;

function initSocket(server) {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', socket => {
    console.log('Socket connected:', socket.id);
    socket.on('join', room => {
      socket.join(room);
    });
    socket.on('disconnect', () => {
      // handle if needed
    });
  });

  ioInstance = io;
  // Export the io instance for other modules to use
  module.exports.io = ioInstance;
}

module.exports.initSocket = initSocket;
module.exports.io = ioInstance; // may be null until initSocket is called
