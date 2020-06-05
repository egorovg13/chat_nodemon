let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

// io.eio.pingTimeout = 240000; 
// io.eio.pingInterval = 10000;  

let { getTimestamp } = require('./public/js/node_timestamp.js');

let users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

app.use(express.static('public'));

io.on('connection', socket => {

    let socketId = socket.id;

    socket.emit('socket-assigned', socketId);

    socket.on('new_user', (receivedName, receivedSurname) => {

        users[socketId] = {};

        let userData = users[socketId];
        
        userData.name = receivedName;
        userData.surname = receivedSurname;
        userData.photo = '/img/no_avatar.png';
        userData.lastMessage = '';

        io.emit('user-connected', socketId, users);
    });

    socket.on('send_message', m => {
        let timeStamp = getTimestamp();

        users[socketId].lastMessage = m;

        socket.broadcast.emit('chat-message', [socketId, m, timeStamp]);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socketId], users);
        delete users[socket.id];
    });

    socket.on('new_avatar', img => {
        users[socketId].photo = img;
        io.emit('avatar-updated', users);
    });
});