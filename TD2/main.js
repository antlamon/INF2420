 class PolyChatView {
     constructor() {
         this.usernameContainer = document.getElementById(`user`);
         this.currentUsername = `Guest`; // à mettre dans le controller
         this.chatContainer = document.getElementById(`chat-container`);
         this.chatHeader = null;
         this.chat = null;
         this.groupContainer = document.getElementById(`group-container`);
         this.groups = null;
         this.currentGroup = "null";
        }
        
        renderView() {
            this.changeUserName();
            this.renderChat();
            this.renderGroups();
            this.refreshConversation();
        }
        
        // Render the elements in the chat container
        renderChat() {
            let buffer = ``;
            // chat header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Groupe actif:</div>
                            <div class="info-text">${this.currentGroup != null ? this.currentGroup : "Veuillez selectionner un groupe"}</div>
                        </div>`;
            if (this.currentGroup != null) {
            // conversation container
            buffer +=   `<div id="conversation"></div>`

            // message input container
            buffer +=   `<div class="input-container">
                            <i class="far fa-thumbs-up" id="like-button"></i>
                            <input id="message-input" name="message-input type="text" placeholder="Votre message ici"/>
                            <div class="small-info-text" id="send-button">Envoyer</div>
                        </div>`
            }
                            
            this.chatContainer.innerHTML = buffer;
            this.refreshConversation();
        }
        
        // Render the elements in the group container
        renderGroups() {
            let buffer = ``;
            // group header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Liste des groupes:</div>
                            <div class="available-group-header">
                                <div class="info-text">Groupes Disponibles</div>
                                <div class="group-options">
                                    <i class="fa fa-plus" id="add-group"></i>
                                    <i class="fa fa-cog" id="group-options"></i>
                                </div>
                            </div>
                        </div>`;
                        
            // group list
            this.groupContainer.innerHTML = buffer;
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
            let view = new PolyChatView();
            view.renderView();
         })();