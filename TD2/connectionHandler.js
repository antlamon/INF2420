// This class manages the websocket to connect to the server.
class ConnectionHandler {

    constructor(){
        this.webSocket = null;
        this.observables = new Map([
            [`onMessage`,[]],
            [`updateChannelsList`,[]],
            [`onGetChannel`, []],
            [`onError`,[]]      
        ])
    }

    // Connects to the websocket and defines the functions for the events onMessage and onClose.
    connect(url, username) {
        this.webSocket = new WebSocket(url+`chatservice?username=${username}`);

        // onMessage event
        this.webSocket.onmessage = function(message){
            let data = JSON.parse(message.data);
            this.notify(data.eventType, data);
        }.bind(this);

        let connectionObserver = setInterval(function() {
            if(this.webSocket.readyState == 1) {
                // Everything's working properly
            } else if (this.webSocket.readyState == 0) {
                alert("Waiting for the server.");
            } else {
                alert(`An error occured with the server, try refreshing the page.`);
            }
        }.bind(this), 5000);
    }

    // Disconnects the websocket from the server.
    disconnect() {
        this.webSocket.close();
    }

    // Notifies the observables of a specific event that occured.
    notify(event, message) {
        this.observables.get(event).forEach(func => {
            func(message);
        });
    }

    // Subscribes an observer to an observable event.
    subscribe(event, func) {
        this.observables.get(event).push(func);
    }

    // Sends a normal message to the server.
    sendMessage(data, model) {
        let msg = new Message("onMessage", model.channelList[model.currentGroupIndex].id, data);
        this.webSocket.send(JSON.stringify(msg));
    }

    // Sends a message to the server whenever a user connects to a channel.            
    sendChannelConnection(isInConnection, id) {
        let msg = new Message(isInConnection ? "onLeaveChannel" : "onJoinChannel", id, "");
        this.webSocket.send(JSON.stringify(msg));
    }

    // Sends an onGetChannel message to the server when a user joins a channel.
    sendOnGetChannel(channelId) {
        let msg = new Message("onGetChannel", channelId);
        this.webSocket.send(JSON.stringify(msg));
    }

    // Sends an onCreateChannel message to the server when a user creates a new channel.
    sendNewChannel(message) {
        let msg = new Message("onCreateChannel", "", message);
        this.webSocket.send(JSON.stringify(msg));
    }
}