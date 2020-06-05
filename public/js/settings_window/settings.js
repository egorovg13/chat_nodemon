import { socket } from '../chat_window/chat.js';

let [chatWindow, settingsWindow, photoCancel, photoSave, photoInput, imagePreview] = 
[
    document.querySelector('.chat_window'),
    document.querySelector('.settings_window'),
    document.querySelector('#photo_cancel'),
    document.querySelector('#photo_save'),
    document.querySelector('#photo_input'),
    document.querySelector('.upload_image'),
];

let fileReader = new FileReader();

let bufferedImage;

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

photoCancel.addEventListener('click', () => {
    chatWindow.style.display = 'block';
    settingsWindow.style.display = 'none';
});

photoSave.addEventListener('click', () => {
    socket.emit('new_avatar', bufferedImage);

    chatWindow.style.display = 'block';
    settingsWindow.style.display = 'none';
});
