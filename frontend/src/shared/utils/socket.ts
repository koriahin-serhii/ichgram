import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      withCredentials: true,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected, joining room:', userId);
      socket?.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('receiveMessage', (message) => {
      console.log('📨 Received message via socket:', message);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
