//Observer that listen to onMessage events and redirect them to the controller.
function onMessage(message) {
    //Sanitize the messages to make sure the data is good.
    message.data = sanitizeHtml(message.data, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
    });
    this.onNewMessage(message);   
}