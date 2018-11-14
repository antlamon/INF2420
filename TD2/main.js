//EntryPoint
(async function() {
    this.connectionHandler = new ConnectionHandler(`ws://log2420-nginx.info.polymtl.ca/`, "VarCestLet");
    //var view = new PolyChatView(null)
 })();

 class PolyChatView {
     constructor() {
         this.username = null;
         this.currentGroup = null;
     }
 }