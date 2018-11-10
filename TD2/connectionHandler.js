class ConnectionHandler {
    constructor(url, username){
        this.webSocket = new WebSocket(url+`chatservice?username=${username}`)
        this.webSocket.onopen = (function (event) {
            this.webSocket.send(JSON.stringify(new Message(`onMessage`, "dbf646dc-5006-4d9f-8815-fd37514818ee", `iknowtheidentityofblob`, username, Date.now()))); 
          }).bind(this);
    }

}