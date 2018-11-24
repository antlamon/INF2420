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
                            <div id="current-group" class="info-text">${polyChatModel.currentGroup != null ? polyChatModel.currentGroup.name : "Général"}</div>
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
            let context = this;
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
        
        refreshUsername(polyChatModel) {
            this.usernameContainer.innerText = polyChatModel.username;
        }

        refreshCurrentGroup(polyChatModel) {
            document.querySelector("#current-group").innerText = polyChatModel.currentGroup.name;
        }

        refreshConversation(polyChatModel) {

        }

        refreshGroups(polyChatModel) {
            if (polyChatModel.channelList.length == 0) return;
            
            let context = this;
            let buffer = ``;
            // Channel general
            buffer +=   `<div class="group "smoke-background"">
                                <i class="fas fa-star orange-icon"></i>
                                <div id="channel-0" class="group-text clickable">${polyChatModel.channelList[0].name} (défaut)</div>
                            </div>`;
            // Other channel
            for(let i = 1; i < polyChatModel.channelList.length; ++i) {
                buffer +=   `<div class="group ${i % 2 ? "lightgray-background" : "smoke-background"}">
                                <i id="channelConnector-${i}" class="${polyChatModel.channelList[i].joinStatus ? "fa fa-minus orange-icon" : "fa fa-plus teal-icon"} clickable"></i>
                                <div id="channel-${i}" class="group-text clickable">${polyChatModel.channelList[i].name == "Général" ? "Géneral (défaut)" : polyChatModel.channelList[i].name}</div>
                            </div>`;
            }
            this.groupContainer.querySelector("#groups").innerHTML = buffer;
            const channels = this.groupContainer.querySelectorAll(`[id^="channel-"]`);
            channels.forEach(channel => {
                channel.addEventListener("click", context.changeCurrentGroup);
            });
            const channelConnectors = this.groupContainer.querySelectorAll(`[id^="channelConnector"]`);
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

                this.setUsername();
                this.initializeConnectionHandler();
                this.view.renderView(this.model);
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
            this.model.username = username;
            this.view.refreshUsername(this.model);
        }

        updateChannelList(list) {
             if(this.model.currentGroup == null) {
                 this.model.currentGroup = list[0];
                 this.view.renderChat(this.model);
             }

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

             this.view.refreshGroups(this.model);
        }

        changeCurrentGroup(event) { 
            const [, index] = event.currentTarget.id.split("-");
            if(!this.model.channelList[index].joinStatus) {
                this.toggleChannelConnection(event);
            }
            this.model.currentGroup = this.model.channelList[index];
            this.view.refreshCurrentGroup(this.model);
        }

        toggleChannelConnection(event) {
            const [, index] = event.currentTarget.id.split("-");
            if(index != 0) {
                let channel = this.model.channelList[index];
                this.connectionHandler.sendChannelConnection(channel.joinStatus, channel.id, this.model);
                //If we want to close the currentChannel, we change the currentChannel to "General"
                if(this.model.currentGroup && channel.id == this.model.currentGroup.id && channel.joinStatus) {
                    this.model.currentGroup = this.model.channelList[0];
                    this.view.refreshCurrentGroup(this.model);
                }
                channel.joinStatus = !channel.joinStatus;
                this.view.refreshGroups(this.model);
            }
        }
        

        initializeConnectionHandler() {
            this.connectionHandler = new ConnectionHandler(`ws://inter-host.ca:3000/`, this.model.username);
            this.connectionHandler.subscribe("updateChannelsList", channelsObserver.bind(this));
        }
    }

    class PolyChatModel {
        constructor() {
            this.username = null;
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
