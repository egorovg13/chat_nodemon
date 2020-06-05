let loginWindow = document.querySelector('.login_window');
let chatWindow = document.querySelector('.chat_window');
let settingsWindow = document.querySelector('.settings_window');

let messageForm = document.querySelector('.message_container');
let messageInput = document.querySelector('.message_input');
let chatHistory = document.querySelector('.chat_history');
let nameInput = document.getElementById('name');
let surnameInput = document.getElementById('surname');
let authBtn = document.getElementById('authorize');
let usersOnline = document.querySelector('.user_count');
let profileBtn = document.querySelector('#profile_settings');
let userPanel = document.querySelector('.user_list');

import { getTimestamp } from './client_service.js';

// profile page


let photoCancel = document.querySelector('#photo_cancel');
let photoSave = document.querySelector('#photo_save');
let photoInput = document.querySelector('#photo_input');
let imagePreview = document.querySelector('.upload_image');

let fileReader = new FileReader();

let bufferedImage;

profileBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    settingsWindow.style.display = 'block';
});

photoCancel.addEventListener('click', () => {
    chatWindow.style.display = 'block';
    settingsWindow.style.display = 'none';
});

photoSave.addEventListener('click', () => {
    socket.emit('new_avatar', bufferedImage);

    chatWindow.style.display = 'block';
    settingsWindow.style.display = 'none';
});

photoInput.addEventListener('change', (e) => {
    let file = e.target.files[0];

    if (file) {
        fileReader.readAsDataURL(file);
    }
});

fileReader.addEventListener('load', () => {
    bufferedImage = fileReader.result;

    imagePreview.src = bufferedImage;
});

// Side panel

const updateUserPanel = (userObj) => {
    userPanel.innerHTML = '';
    Object.keys(userObj).forEach(user => {
        createUserCard(user, userObj);
    });
};

const createUserCard = (user, userObj) => {

    let userData = userObj[user];

    let userName = userData.name + ' ' + userData.surname;

    let userCard = document.createElement('div');
    let imageWrapper = document.createElement('div');
    let cardImage = document.createElement('img');
    let cardName = document.createElement('div');
    let cardMessage = document.createElement('div');

    userCard.classList.add('user_card');
    imageWrapper.classList.add('image_wrapper');
    cardImage.classList.add('card_image');
    cardName.classList.add('card_name');
    cardMessage.classList.add('card_message');
    cardMessage.classList.add(user);

    imageWrapper.append(cardImage);
    userCard.append(imageWrapper);
    userCard.append(cardName);
    userCard.append(cardMessage);

    userPanel.append(userCard);

    cardImage.src = userData.photo;
    cardName.innerText = userName;
    cardMessage.innerText = userData.lastMessage;
};


// connection & main

let users;
let mySocket;

const socket = io ('http://localhost:3000');

const updateLastMessage = (userId, message) => {
    let userSelector = '.' + userId;
    let messageContainer = document.querySelector(userSelector);
    
    messageContainer.innerText = message;
}


socket.on('socket-assigned', socketId => {
    mySocket = socketId;
    console.log(`Socket assigned: ${mySocket}`);


})

socket.on('chat-message', ([userId, message, timeStamp]) => {
    updateLastMessage(userId, message);
    addChatHistory(userId, message, timeStamp, true);
});

const addChatHistory = (userId, message, timeStamp, received) => {

    let chatEntry = document.createElement('div');
    let chatAvatarRecieving = document.createElement('img');
    let chatMessage = document.createElement('div');
    let chatText = document.createElement('div');
    let messageTimeStamp = document.createElement('div');
    let chatAvatarSending = document.createElement('img');

    chatEntry.classList.add('chat_entry');
    chatAvatarRecieving.classList.add('chat_avatar');
    chatMessage.classList.add('chat_message');
    chatText.classList.add('chat_text');
    messageTimeStamp.classList.add('timestamp');
    chatAvatarSending.classList.add('chat_avatar');

    chatMessage.append(chatText);
    chatMessage.append(messageTimeStamp);

    chatEntry.append(chatAvatarRecieving);
    chatEntry.append(chatMessage);
    chatEntry.append(chatAvatarSending);

    chatText.innerText = message;
    messageTimeStamp.innerText = timeStamp;

    let userData = users[userId];
    let userPhoto = userData.photo;

    if (received) {
        chatAvatarRecieving.src = userPhoto;
        chatMessage.style.justifySelf = 'start';
        chatAvatarSending.style.visibility = 'hidden';
        chatMessage.classList.add('received-message');

    } else {
        chatAvatarSending.src = userPhoto;
        chatAvatarRecieving.style.visibility = 'hidden';
        chatMessage.classList.add('sent-message');
    };

    chatHistory.append(chatEntry);
}

socket.on('user-connected', (id, userObj) => {

    // appendMessage (`${username} подключился к чату`);
    // users = userObj; // непонятно нужен ли
    
    // updateUsers(users);

    users = userObj;
    updateUserPanel(userObj);
    updateUserCount(userObj);

});

// Avatar update recieved

socket.on('avatar-updated', userObj => {
    users = userObj;
    updateUserPanel(userObj);
});


socket.on('system-message', data => {
    appendMessage (data);
});

socket.on('user-disconnected', (user, userObj) => {
    users = userObj;
    if (user) {
        // appendMessage(`${user.name} отключился. Скатертью дорожка!`);
        users = userObj;
        updateUserCount(users);
    }
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    let message = messageInput.value;
    let time = getTimestamp();
    console.log(time);

    updateLastMessage(mySocket, message);

    // appendMessage(`Вы: ${message}`);

    addChatHistory(mySocket, message, time, false);

    socket.emit('send_message', message);
    messageInput.value = '';

});

authBtn.addEventListener('click', () => {
    let userName = nameInput.value;
    let userSurname = surnameInput.value;

    socket.emit('new_user', userName, userSurname);

    loginWindow.style.display = 'none';
    chatWindow.style.display = 'block';
})


const appendMessage = (m) => {
    let messageBlock = document.createElement('li');
    
    messageBlock.innerText = m;
    chatHistory.append(messageBlock);
}

const updateUserCount = (userObj) => {
    let userCount = Object.keys(userObj).length;

    usersOnline.innerText = `Участников онлайн: ${userCount}`;
    updateUserPanel(userObj);
}