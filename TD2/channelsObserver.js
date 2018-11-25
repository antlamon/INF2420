function updateChannelObserver(message) {
    let data = message.data;
    this.updateChannelList(data);
}

function onGetChannelObserver(message) {
    let data = message.data;
    data.messages.forEach(element => {
        element.data = sanitizeHtml(element.data, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
        });
    });
    this.bulkMessage(data);
}