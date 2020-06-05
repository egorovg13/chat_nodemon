let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let { getTimestamp } = require('./js/node_service');

let users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));



io.on('connection', socket => {

    let socketId = socket.id;
    
    console.log('new user');

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
        console.log(users);
        io.emit('avatar-updated', users);
    });
});