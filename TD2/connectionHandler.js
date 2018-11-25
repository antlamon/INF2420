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

    connect(url, username) {
        this.webSocket = new WebSocket(url+`chatservice?username=${username}`);
        this.webSocket.onmessage = function(message){
            let data = JSON.parse(message.data);
            this.notify(data.eventType, data);
        }.bind(this);
    }

    disconnect() {
        this.webSocket.close();
    }

    notify(event, message) {
        this.observables.get(event).forEach(func => {
            func(message);
        });
    }

    subscribe(event, func) {
        this.observables.get(event).push(func);
    }

    sendMessage(data, model) {
        let msg = new Message("onMessage", model.channelList[model.currentGroupIndex].id, data);
        this.webSocket.send(JSON.stringify(msg));
    }

    sendChannelConnection(isInConnection, id) {
        let msg = new Message(isInConnection ? "onLeaveChannel" : "onJoinChannel", id, "");
        this.webSocket.send(JSON.stringify(msg));
    }

    sendOnGetChannel(channelId) {
        let msg = new Message("onGetChannel", channelId);
        this.webSocket.send(JSON.stringify(msg));
    }
    sendNewGroup(message) {
        let msg = new Message("onCreateChannel", "", message);
        this.webSocket.send(JSON.stringify(msg));
    }
}