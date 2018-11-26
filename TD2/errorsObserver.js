//Observer that listen to onError events and redirect them to the controller.
function onErrorObserver(message) {
    let data = message.data;
    this.onNewError(data);
}