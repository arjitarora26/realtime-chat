const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


// Output message received from server
socket.on('message', message => {
    outputMessage(message);
    // Scroll to the last msg in chat after sending
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


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


// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p></div>`;
    chatMessages.append(div);
}