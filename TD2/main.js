 class PolyChatView {
     constructor() {
         this.usernameContainer = document.getElementById(`user`);
         this.chatContainer = document.getElementById(`chat-container`);
         this.groupContainer = document.getElementById(`group-container`);
         this.onClickSendMessage = null;
        }
        
        renderView(polyChatModel) {
            this.renderChat(polyChatModel);
            this.renderGroups(polyChatModel);
            
        }
        
        // Render the elements in the chat container
        renderChat(polyChatModel) {
            let context = this;
            let buffer = ``;
            // chat header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Groupe actif:</div>
                            <div class="info-text">${polyChatModel.currentGroup != null ? polyChatModel.currentGroup.name : "Général"}</div>
                        </div>`;
            // conversation container
            buffer +=   `<div class="scrollable-container" id="conversation"></div>`;

            // message input container
            buffer +=   `<div class="input-container">
                            <i class="far fa-thumbs-up clickable" id="like-button"></i>
                            <input id="message-input" name="message-input type="text" placeholder="Votre message ici"/>
                            <div class="small-info-text clickable" id="send-button">Envoyer</div>
                        </div>`;          

            this.chatContainer.innerHTML = buffer;

            const sendButton = this.chatContainer.querySelector("#send-button");
            sendButton.addEventListener("click", context.onClickSendMessage);
        }
        
        // Render the elements in the group container
        renderGroups(polyChatModel) {
            let buffer = ``;
            // group header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Liste des groupes:</div>
                            <div class="available-group-header">
                                <div class="info-text">Groupes Disponibles</div>
                                <div class="group-options">
                                    <i class="fa fa-plus clickable" id="add-group"></i>
                                    <i class="fa fa-cog" id="group-options"></i>
                                </div>
                            </div>
                        </div>`;
            // groups list container
            buffer +=   `<div class="scrollable-container" id="groups"></div>`;
                        
            this.groupContainer.innerHTML = buffer;
        }
        
        changeUsername(polyChatModel) {
            this.usernameContainer.innerText = polyChatModel.user.username;
        }

        refreshConversation(polyChatModel) {

        }

        refreshGroups(polyChatModel) {
            if (polyChatModel.channelList == null) return;
            
            let buffer = ``;
            // Channel general
            buffer +=   `<div class="group "smoke-background"">
                                <i class="fas fa-star orange-icon"></i>
                                <div class="group-text">${polyChatModel.channelList[0].name} (défaut)</div>
                            </div>`;
            // Other channel
            for(let i = 1; i < polyChatModel.channelList.length; ++i) {
                buffer +=   `<div class="group ${i % 2 ? "lightgray-background" : "smoke-background"}">
                                <i class="${polyChatModel.channelList[i].joinStatus ? "fa fa-minus orange-icon" : "fa fa-plus teal-icon"} clickable"></i>
                                <div class="group-text">${polyChatModel.channelList[i].name == "Général" ? "Géneral (défaut)" : polyChatModel.channelList[i].name}</div>
                            </div>`;
            }
            this.groupContainer.querySelector("#groups").innerHTML = buffer;
        }
    }
    
    class PolyChatController {
        constructor(polyChatView, polyChatModel){
                this.connectionHandler = null;
                this.view = polyChatView;
                this.model = polyChatModel;

                this.view.onClickSendMessage = this.onClickSendMessage.bind(this);
                
                this.setUsername();
                this.initializeConnectionHandler();
                this.view.renderView(this.model);
        }

        onClickSendMessage() {
            debugger
            let message = this.view.chatContainer.querySelector("#message-input").value;
            if(message != "") {
                this.connectionHandler.sendMessage(message, this.model);
                this.view.chatContainer.querySelector("#message-input").value = "";
            }   
        }

        setUsername() {
            let username = prompt("Entrer un nom d'utilisateur", "");
            this.model.user.username = username;
            this.view.changeUsername(this.model);
        }

        updateChannelList(list) {
             // Need to filter the list and add the missing item not a bonobo assignation like this. ONLY TEMP
             this.model.channelList = list;
             if(this.model.currentGroup == null) {
                 this.model.currentGroup = list[0];
                 this.model.user.connectedChannel.push(list[0]);
                 this.view.renderChat(this.model);
             }
             this.view.refreshGroups(this.model);
        }

        initializeConnectionHandler() {
            this.connectionHandler = new ConnectionHandler(`ws://inter-host.ca:3000/`, this.model.user.username);
            this.connectionHandler.subscribe("updateChannelsList", channelsObserver.bind(this));
        }
    }

    class PolyChatModel {
        constructor() {
            this.user = {
                username : null,
                connectedChannel : []
            };
            this.channelList = [];
            this.currentGroup = null;
        }
    }

    // EntryPoint
    (async function() {
        let view = new PolyChatView();
        let model = new PolyChatModel();
        new PolyChatController(view, model);
        })();
