import { socket } from '../chat_window/chat.js';

const [loginWindow, chatWindow, nameInput, surnameInput, authBtn] = 
[
    document.querySelector('.login_window'),
    document.querySelector('.chat_window'),
    document.getElementById('name'),
    document.getElementById('surname'),
    document.getElementById('authorize')
];

authBtn.addEventListener('click', () => {
    let userName = nameInput.value;
    let userSurname = surnameInput.value;

    socket.emit('new_user', userName, userSurname);

    loginWindow.style.display = 'none';
    chatWindow.style.display = 'block';
});

