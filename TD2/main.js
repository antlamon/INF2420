 class PolyChatView {
     constructor() {
         this.usernameContainer = document.getElementById(`user`);
         this.chatContainer = document.getElementById(`chat-container`);
         this.groupContainer = document.getElementById(`group-container`);
         this.onClickSendMessage = null;
         this.changeCurrentGroup = null;
        }
        
        renderView(polyChatModel) {
            this.renderChat(polyChatModel);
            this.renderGroups(polyChatModel);
            this.refreshGroups(polyChatModel);
            
        }
        
        // Render the elements in the chat container
        renderChat(polyChatModel) {
            let context = this;
            let buffer = ``;
            // chat header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Groupe actif:</div>
                            <div class="info-text">${polyChatModel.currentGroup != null ? polyChatModel.currentGroup.name : "Veuillez selectionner un groupe"}</div>
                        </div>`;
            if (polyChatModel.currentGroup != null) {
                // conversation container
                buffer +=   `<div class="scrollable-container" id="conversation"></div>`

                // message input container
                buffer +=   `<div class="input-container">
                                <i class="far fa-thumbs-up" id="like-button"></i>
                                <input id="message-input" name="message-input type="text" placeholder="Votre message ici"/>
                                <div class="small-info-text" id="send-button">Envoyer</div>
                            </div>`                         
            }
            this.chatContainer.innerHTML = buffer;
            
            const sendButton = this.chatContainer.querySelector("#send-button");
            if(sendButton){
                sendButton.addEventListener("click", context.onClickSendMessage);
            }
        }
        
        // Render the elements in the group container
        renderGroups(polyChatModel) {
            let buffer = ``;
            let context = this;
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
            let context = this;
            let groupsContainer = document.getElementById("groups");
            let buffer = ``;
            for(let i = 0; i < polyChatModel.channelList.length; ++i) {
                buffer +=   `<div class="group  ${i % 2 ? "lightgray-background" : "smoke-background"}">
                                <i id =channel-${i} class="channelConnector ${polyChatModel.channelList[i].name == "Général" ? "fas fa-star" : polyChatModel.channelList[i].joinStatus ? "fas fa-minus" :"fas fa-plus"} ${polyChatModel.channelList[i].joinStatus ? "orange-icon" : "teal-icon"}"></i>
                                <div id =channel-${i} class="group-text channel">${polyChatModel.channelList[i].name == "Général" ? "Géneral (défaut)" : polyChatModel.channelList[i].name}</div>
                            </div>`;
            }
            groupsContainer.innerHTML = buffer;
            const channels = this.groupContainer.querySelectorAll(".channel");
            channels.forEach(channel => {
                channel.addEventListener("click", context.changeCurrentGroup);
            });
            const channelConnectors = this.groupContainer.querySelectorAll(".channelConnector");
            channelConnectors.forEach(channelConnector => {
                channelConnector.addEventListener("click", context.toggleChannelConnection)
            });
        }
    }
    
    class PolyChatController {
        constructor(polyChatView, polyChatModel){
                this.connectionHandler = null;
                this.view = polyChatView;
                this.model = polyChatModel;

                this.view.onClickSendMessage = this.onClickSendMessage.bind(this);
                this.view.changeCurrentGroup = this.changeCurrentGroup.bind(this);
                this.view.toggleChannelConnection = this.toggleChannelConnection.bind(this);

                this.model.currentGroup = this.model.channelList[0];

                this.view.renderView(this.model);
                this.setUsername();
                this.initializeConnectionHandler();

        }

        //Send a message to the current channel whenever the 
        onClickSendMessage() {
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
            this.model.channelList.forEach(element => {
                if(list.findIndex(c => c.id === element.id < 0)) {
                    this.model.channelList.splice(element.id);
                }
            });

            list.forEach(element => {
                if(this.model.channelList.findIndex(c => c.id === element.id) < 0) {
                    this.model.channelList.push(element);
                }
             });

            this.view.renderView(this.model);
        }

        changeCurrentGroup(event) { 
            const [, index] = event.currentTarget.id.split("-");
            if(!this.model.channelList[index].joinStatus) {
                this.toggleChannelConnection(event);
            }
            this.model.currentGroup = this.model.channelList[index];
            this.view.renderView(this.model);
        }

        toggleChannelConnection(event) {
            const [, index] = event.currentTarget.id.split("-");
            if(index != 0) {
                let channel = this.model.channelList[index];
                this.connectionHandler.sendChannelConnection(channel.joinStatus, channel.id, this.model);
                //If we want to close the currentChannel, we change the currentChannel to "General"
                if(this.model.currentGroup && channel.id == this.model.currentGroup.id && channel.joinStatus) this.model.currentGroup = this.model.channelList[0];
                channel.joinStatus = !channel.joinStatus;
                this.view.renderView(this.model);
            }
        }
        

        initializeConnectionHandler() {
            this.connectionHandler = new ConnectionHandler(`ws://inter-host.ca:3000/`, this.model.user.username);
            this.connectionHandler.subscribe("updateChannelsList", channelsObserver.bind(this));
        }
    }

    class PolyChatModel {
        constructor() {
            this.user = {
                username : "Guest",
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
