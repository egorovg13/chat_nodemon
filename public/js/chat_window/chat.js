import { updateUserPanel, getTimestamp, updateLastMessage, updateUserCount, addChatHistory } from './chat_functions.js';

let [chatWindow, settingsWindow, messageForm, messageInput, profileBtn] = 
[
    document.querySelector('.chat_window'),
    document.querySelector('.settings_window'),
    document.querySelector('.message_container'),
    document.querySelector('.message_input'),
    document.querySelector('#profile_settings'),
];

let users;
let mySocket;

// eslint-disable-next-line no-undef
const socket = io ('http://localhost:3000');

socket.on('socket-assigned', socketId => {
    
    let oldSocketSelector = '.' + mySocket;
    let oldCard = document.querySelector(oldSocketSelector);

    if (oldCard) {
        oldCard.classList.add(socketId);
    }

    mySocket = socketId;
    console.log(`Socket assigned: ${mySocket}`);
});

socket.on('chat-message', ([userId, message, timeStamp]) => {
    updateLastMessage(userId, message);
    addChatHistory(userId, users, message, timeStamp, true);
});

socket.on('user-connected', (id, userObj) => {
    users = userObj;
    updateUserPanel(userObj);
    updateUserCount(userObj);
});

socket.on('avatar-updated', userObj => {
    users = userObj;
    updateUserPanel(userObj);
});

socket.on('user-disconnected', (user, userObj) => {
    users = userObj;
    if (user) {
        users = userObj;
        updateUserCount(users);
    }
});

profileBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    settingsWindow.style.display = 'block';
});

messageForm.addEventListener('submit', e => {
    let message = messageInput.value;

    e.preventDefault();

    if (message.length > 0)

    {
        let time = getTimestamp();

        updateLastMessage(mySocket, message);

        addChatHistory(mySocket, users, message, time, false);

        socket.emit('send_message', message);
        messageInput.value = '';
}

});

export { socket };