const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.emit('chat message', `${socket.id} is connected`);
  console.log(`${socket.id} is connected`);
  socket.on('disconnect', () => {
    io.emit('chat message', `${socket.id} is disconnected`);
    console.log(`${socket.id} is disconnected`);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.id}: ${msg}`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
