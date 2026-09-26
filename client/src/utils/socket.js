import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
  }
  if (userId) {
    socket.emit('join_user_room', userId);
  }
};

export const joinOrderRoom = (orderId) => {
  if (socket) {
    socket.emit('join_order_room', orderId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
