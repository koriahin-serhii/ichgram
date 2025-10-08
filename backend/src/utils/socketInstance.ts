import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const setSocketIO = (ioInstance: SocketIOServer) => {
  io = ioInstance;
};

export const getSocketIO = (): SocketIOServer | null => {
  return io;
};
