import { Server as SocketIOServer, Socket } from 'socket.io';
import MessageModel from '../models/messageModel.js';
import mongoose from 'mongoose';

export function setupSocketIO(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    // User joins their own room (userId is sent from client after auth)
    socket.on('join', (userId: string) => {
      socket.join(userId);
    });

    // Handle sending a message
    socket.on(
      'sendMessage',
      async (data: { sender: string; recipient: string; text: string }) => {
        try {
          // Save message to DB
          const message = await MessageModel.create({
            sender: new mongoose.Types.ObjectId(data.sender),
            recipient: new mongoose.Types.ObjectId(data.recipient),
            text: data.text,
          });
          // Emit to recipient if online
          io.to(data.recipient).emit('receiveMessage', message);
          // Optionally, emit to sender for confirmation
          socket.emit('messageSent', message);
        } catch (error) {
          socket.emit('error', { message: 'Message not sent', error });
        }
      }
    );
  });
}
