let [chatHistory, usersOnline, userPanel] = 
[
    document.querySelector('.chat_history'),
    document.querySelector('.user_count'),
    document.querySelector('.user_list'),
];

const updateUserPanel = (userObj) => {
    userPanel.innerHTML = '';
    Object.keys(userObj).forEach(user => {
        createUserCard(user, userObj);
    });
};

const getTimestamp = () => {
    let today = new Date();
    let timeStamp = today.getHours() + ':' + today.getMinutes();
    
    return timeStamp;
};

const updateLastMessage = (userId, message) => {
    let userSelector = '.' + userId;
    let messageContainer = document.querySelector(userSelector);
    
    messageContainer.innerText = message;
};

const updateUserCount = (userObj) => {
    let userCount = Object.keys(userObj).length;

    usersOnline.innerText = `Участников онлайн: ${userCount}`;
    updateUserPanel(userObj);
};

const addChatHistory = (userId, users, message, timeStamp, received) => {

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
    }

    chatHistory.append(chatEntry);
    chatHistory.scrollTop = chatHistory.scrollHeight;
};


//  no export, used locally
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

export { updateUserPanel, getTimestamp, updateLastMessage, updateUserCount, addChatHistory };
