//Observer that listen to updateChannelList events and redirect them to the controller.
function updateChannelObserver(message) {
    let data = message.data;
    this.updateChannelList(data);
}

//Observer that listen to onGetChannel events and redirect them to the controller.
function onGetChannelObserver(message) {
    let data = message.data;
    //Sanitize the messages to make sure the data is good.
    data.messages.forEach(element => {
        element.data = sanitizeHtml(element.data, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
        });
    });
    this.bulkMessage(data);
}