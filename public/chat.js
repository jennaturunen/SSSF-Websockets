'use strict';

const socket = io();

const allRooms = document.querySelectorAll('.room');
const showSelectedRoom = document.querySelector('#selected-room');
let enterRoom = '';
let leaveRoom = '';

for (const room of allRooms) {
  room.addEventListener('click', () => {
    document.getElementById('messages').innerHTML = '';
    document.querySelector('#send-msg-form').style.display = 'block';
    enterRoom = room.textContent;
    socket.emit('joinRoom', enterRoom);
    showSelectedRoom.textContent = `You entered to room: ${enterRoom}`;

    if (leaveRoom.length > 0) {
      socket.emit('leaveRoom', leaveRoom);
    }

    leaveRoom = room.textContent;
  });
}

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const inp = document.getElementById('message');
  let username = document.querySelector('#username').value;
  if (username === '') {
    username = 'anonymous';
  }

  socket.emit('chat message', enterRoom, `${username} says: ${inp.value}`);
  inp.value = '';
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = msg;
  document.getElementById('messages').appendChild(item);
});
