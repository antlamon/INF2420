class ConnectionHandler {

    constructor(url, username){
        this.webSocket = new WebSocket(url+`chatservice?username=${username}`)
        this.observables = new Map([
            [`onMessage`,[]],
            [`onCreateChannel`, []],
            [`onJoinChannel`,[]],
            [`onLeaveChannel`,[]],
            [`updateChannelsList`,[]],
            [`onError`,[]]      
        ])
        this.webSocket.onmessage = function(message){
            let data = JSON.parse(message.data);
            this.notify(data.eventType, data);
        }.bind(this);
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
        let msg = new Message("onMessage", model.currentGroup.id, data, model.user.username, Date.now());
        this.webSocket.send(JSON.stringify(msg));
    }
    sendChannelConnection(isInConnection, id, model) {
        let msg = new Message(isInConnection ? "onLeaveChannel" : "onJoinChannel", id, "", model.user.username, Date.now());
        this.webSocket.send(JSON.stringify(msg));
    }

}