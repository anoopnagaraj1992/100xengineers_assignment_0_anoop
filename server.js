const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

const emojiMap = {
    'hey': '👋',
    'lol': '😂',
    'like': '👍',
    'congratulations': '🎉',
    'react': '⚛️' // Using the atom symbol to represent React.js
};

function replaceWithEmojis(message) {
    for (const [text, emoji] of Object.entries(emojiMap)) {
        const regex = new RegExp(`\\b${text}\\b`, 'gi'); // Matches the word using word boundaries and ignoring case
        message = message.replace(regex, emoji);
    }
    return message;
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('send message', (data) => {
        data.message = replaceWithEmojis(data.message); // Replace text with emojis
        // Broadcast to all clients including the sender
        io.emit('receive message', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
