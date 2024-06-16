const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const serverData = [];
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('/' + __dirname + 'public/index.html');
  res.sendFile(__dirname + 'public/index.html');
});

io.on('connection', (socket) => {
  io.emit('chat message', `${socket.id} is connected`);
  console.log(`${socket.id} is connected`);
  socket.on('disconnect', () => {
    adjustArray(socket.id);
    io.emit('chat message', `${socket.id} is disconnected`);
    console.log(`${socket.id} is disconnected`);
    console.log(serverData);
  });
  socket.on('meta data', (data) => {
    data.id = socket.id;
    data.totalScore = 0;
    serverData.push(data);
    console.log(serverData);
  });
  socket.on('chat message', (msg) => {
    const userObject = serverData.filter((arg) => arg.id === socket.id)[0];
    console.log('userObject');
    console.log(userObject);
    console.log('end');
    io.emit('chat message', `${userObject.username}: ${msg}`);
  });
  socket.on('cast dice', (data) => {
    console.log('work?');
    const newScore = Math.floor(Math.random() * 6 + 1);
    let obj = serverData.find((obj) => obj.username === data.username);
    if (obj) {
      obj.totalScore = obj.totalScore + newScore;
    }
    console.log(obj);
    io.emit(
      'chat message',
      `${obj.username} cast a ${newScore} and has a total of ${obj.totalScore} played`
    );
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

function adjustArray(id) {
  for (let i = serverData.length - 1; i >= 0; i--) {
    if (id === serverData[i].id) {
      serverData.splice(i, 1);
    }
  }
}
