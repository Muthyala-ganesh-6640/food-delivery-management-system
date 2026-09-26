const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room: ${userId}`);
      }
    });

    socket.on('join_order_room', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined order room: order_${orderId}`);
      }
    });

    socket.on('update_location', (data) => {
      // Broadcast delivery partner live location to order room
      const { orderId, lat, lng } = data;
      if (orderId) {
        io.to(`order_${orderId}`).emit('delivery_location_updated', { lat, lng });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    console.warn('Socket.io not initialized yet');
  }
  return io;
};

module.exports = { initSocket, getIO };
