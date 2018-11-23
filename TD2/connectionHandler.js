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
            this.notify(data.eventType);
        }.bind(this);
    }
    notify(event) {
        this.observables.get(event).forEach(func => {
            debugger
            func();
        });
    }

    subscribe(event, func) {
        this.observables.get(event).push(func);
    }   

}