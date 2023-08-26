const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));

// Function to replace words with emojis
function replaceWordsWithEmojis(text) {
    const emojiMap = {
        'react': '⚛️',
        'hey': '👋',
        'lol': '😂',
        'like': '👍',
        'congratulations': '🎉'
    };

    return text.replace(/\b(react|hey|lol|like|congratulations)\b/gi, (matched) => {
        return emojiMap[matched.toLowerCase()] || matched;
    });
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('send message', (data) => {
        console.log('Message received', data);
        
        // Replace certain words with emojis before broadcasting
        data.message = replaceWordsWithEmojis(data.message);

        // Broadcast to all clients
        io.emit('receive message', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
