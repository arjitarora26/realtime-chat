const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const { getUserById, getUsersByRoom, addUserToRoom, userLeave} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "BOT";

// Run when client connects
io.on('connection', socket => {
    // console.log(`New WS established : ${socket.id}`);
    
    //when client connects
    socket.on('joinRoom', ({ username, room }) => {
        const user = addUserToRoom(socket.id, username, room);
        socket.join(room);
        socket.emit('message', formatMessage(botName, `Welcome to the ${room} chat room, <b>${username}</b>!!`));
        socket.broadcast
            .to(room)
            .emit('message', formatMessage(botName, `<b>${username}</b> has joined the chat!`));
        io.to(room).emit('roomusers', {
            room,
            users : getUsersByRoom(room)
        });
    });

    // messages
    socket.on('chatMessage', msg => {
        const user = getUserById(socket.id);
        if(user === undefined) {
            socket.emit('message', formatMessage(botName,"Something went wrong. Relogin"));
            return;
        };
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `<b>${user.username}</b> has left the chat`));
            io.to(user.room).emit('roomusers', {
                room : user.room,
                users : getUsersByRoom(user.room)
            });
        }
    });
})

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));