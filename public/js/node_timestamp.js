const getTimestamp = () => {
    let today = new Date();
    let timeStamp = today.getHours() + ':' + today.getMinutes();
    
    return timeStamp;
};

exports.getTimestamp = getTimestamp;
