// api/socket.js

import { Server } from 'socket.io';

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  let clientsCount = 0;

  io.on('connection', (socket) => {
    clientsCount++;
    console.log('Number of clients connected: ', clientsCount);

    socket.on('lock_page', (path) => {
      console.log('lock_page event received with path:', path);
      socket.broadcast.emit('lock_page_student', path);
    });

    socket.on('unlock_page', () => {
      console.log('unlock_page event received');
      socket.broadcast.emit('unlock_page_student');
    });

    socket.on('disconnect', () => {
      clientsCount--;
      console.log('Number of clients connected: ', clientsCount);
    });
  });

  console.log('Setting up socket');
  res.end();
}
