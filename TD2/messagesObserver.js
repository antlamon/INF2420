function onMessage(message) {
    message.data = sanitizeHtml(message.data, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
    });
    this.onNewMessage(message);   
}