const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');

const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', {username, room});

// Output message received from server
socket.on('message', message => {
    outputMessage(message);
    // Scroll to the last msg in chat after sending
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomusers', ({room, users}) => {
    outputRoomname(room);
    outputUsers(users);
});

// Send Message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Send message from chatbox to server
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Format timestamp by locale as "hh:mm am|pm"
function formatTime(time) {
    const date = new Date(time);

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${formatTime(message.time)}</span></p>
    <p class="text">${message.text}</p></div>`;
    chatMessages.append(div);
}


function outputRoomname(room) {
    roomName.textContent = room;
}

function outputUsers(users) {
    roomUsers.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}