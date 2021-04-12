'use strict';

const express = require('express');
const app = express();

const fs = require('fs');
const sslkey = fs.readFileSync('../ssl-key.pem');
const sslcert = fs.readFileSync('../ssl-cert.pem');

const options = {
  key: sslkey,
  cert: sslcert,
};

const https = require('https').createServer(options, app);
const io = require('socket.io')(https);

// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
  });

  socket.on('chat message', (room, msg) => {
    io.to(room).emit('chat message', msg);
  });

  /* // When you want to send message to all, no matter which room
  socket.on('chat message', (msg) => {
    console.log('message: ', msg);
    io.emit('chat message', msg);
  }); */
});

// http.listen(3000, () => {
//   console.log('listening on port 3000');
// });

https.listen(3000, () => {
  console.log('listening on port 3000');
});
