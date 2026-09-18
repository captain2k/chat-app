import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { socketAuthMiddleWare } from '../middleware/socket.auth.middleware.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleWare);

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('A user connected', socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, server, app };
