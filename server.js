const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "BOT";

// Run when client connects
io.on('connection', socket => {
    // console.log(`New WS established : ${socket.id}`);

    /*
        socket.emit()           ----> to socket
        socket.broadcast.emit() ----> to every connection except current socket
        io.emit()               ----> all connections
    */

    // when client connects
    socket.emit('message', formatMessage(botName,'Welcome to the chat room!!'));
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat!'));
    
    // when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'user has left the chat'));
    });


    // messages
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage("USER", msg));
        console.log(msg);
    })
})

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));