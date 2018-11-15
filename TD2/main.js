
 class PolyChatView {
     constructor() {
         this.usernameContainer = document.getElementById(`user`);
         this.currentUsername = `hello`; // à mettre dans le controller
         this.chatContainer = document.getElementById(`chat-container`);
         this.chatHeader = null;
         this.chat = null;
         this.groupContainer = document.getElementById(`group-container`);
         this.groups = null;
         this.currentGroup = `Général`;
        }
        
        renderView() {
            this.changeUserName();
            this.renderChat();
            this.renderGroups();
            this.refreshConversation();
        }
        
        // Render the elements in the chat container
        renderChat() {
            var buffer = ``;
            // chat header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Groupe actif:</div>
                            <div class="info-text">${this.currentGroup}</div>
                        </div>`;
                        
            this.chatContainer.innerHTML = buffer;
            this.refreshConversation();
        }
        
        // Render the elements in the group container
        renderGroups() {
            
        }
        
        changeUserName() {
            this.usernameContainer.innerText = this.currentUsername;
        }

        refreshConversation() {

        }
    }

        // EntryPoint
        (async function() {
            //this.connectionHandler = new ConnectionHandler(`ws://log2420-nginx.info.polymtl.ca/`, "VarCestLet");
            var view = new PolyChatView();
            view.renderView();
         })();