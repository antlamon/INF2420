 class PolyChatView {
     constructor() {
         this.chatContainer = document.getElementById(`chat-container`);
         this.groupContainer = document.getElementById(`group-container`);
         this.headerOptionsContainer = document.getElementById(`header-options`);
         this.modalContainer = document.getElementById(`modal-container`);
         this.onClickSendMessage = null;
         this.changeCurrentGroup = null;
         this.onClickAddChannel = null;
         this.onClickSendThumbsUp = null;
         this.changeUsername = null;
         this.toggleMuteApplication = null;
        }
        
        renderView(polyChatModel) {
            this.renderHeaderOptions(polyChatModel);
            this.renderChat(polyChatModel);
            this.renderGroups(polyChatModel);
        }
        
        renderHeaderOptions(polyChatModel){
            let buffer = ``;
            buffer += ` <div class="clickable" id="user-option">
                            <i class="far fa-user"></i>
                            <div id="user">${polyChatModel.username}</div>
                        </div>
                        <i class="far fa-bell clickable notif-bell" id="bell"></i>
                        <i class="fa fa-globe"></i>
                        <i class="fa fa-cog" id="options"></i>`;
            this.headerOptionsContainer.innerHTML = buffer;
            const user = document.querySelector("#user-option");
            user.addEventListener("click", this.renderModalUsername.bind(this));
            const bell = document.querySelector(`#bell`)
            bell.addEventListener("click", this.toggleMuteApplication)
        }
        
        // Render the elements in the chat container
        renderChat(polyChatModel) {
            let context = this;
            let buffer = ``;
            // chat header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Groupe actif:</div>
                            <div id="current-group" class="info-text">${polyChatModel.channelList[polyChatModel.currentGroupIndex] != null ? polyChatModel.channelList[polyChatModel.currentGroupIndex].name : "Général"}</div>
                        </div>`;
            // conversation container
            buffer +=   `<div class="scrollable-container" id="conversation"></div>`;

            // message input container
            buffer +=   `<div class="input-container">
                            <i class="far fa-thumbs-up clickable" id="like-button"></i>
                            <input id="message-input" name="message-input type="text" placeholder=" Votre message ici"/>
                            <div class="small-info-text clickable" id="send-button">Envoyer</div>
                        </div>`;          

            this.chatContainer.innerHTML = buffer;

            const sendButton = this.chatContainer.querySelector("#send-button");
            sendButton.addEventListener("click", context.onClickSendMessage);
            document.addEventListener("keydown", function(event) {
                if (event.keyCode === 13) {
                  document.getElementById("send-button").click();
                }
            });
            const thumbsUpButton = this.chatContainer.querySelector("#like-button");
            thumbsUpButton.addEventListener("click", context.onClickSendThumbsUp);
        }

        // Render the conversation on joining the channel
        renderConversation(polyChatModel) {
            let buffer = ``;
            polyChatModel.channelList[polyChatModel.currentGroupIndex].messages.forEach(message => {
                const sender = message.sender;
                let date = new Date(message.timestamp);
                if(sender == polyChatModel.username) {
                    buffer += ` <div class="message own-message">
                                    <div class="text-message">${message.data}</div>
                                    <div class="date">${date.toString().slice(0, 21)}</div>
                                </div>`;
                } else if(sender == "Admin") {
                    buffer += ` <div class="admin-message">${message.data}</div>`;
                } else {
                    buffer += ` <div class="message other-message">
                                    <div class="sender">${sender}</div>
                                    <div class="text-message">${message.data}</div>
                                    <div class="date">${date.toString().slice(0, 21)}</div>
                                </div>`;
                }
            });
            this.chatContainer.querySelector("#conversation").innerHTML = buffer;
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
                                    <i class="fa fa-cog clickable" id="group-options"></i>
                                </div>
                            </div>
                        </div>`;
            // groups list container
            buffer +=   `<div class="scrollable-container" id="groups"></div>`;
                        
            this.groupContainer.innerHTML = buffer;
            const addGroupButton = this.groupContainer.querySelector("#add-group");
            addGroupButton.addEventListener("click", context.onClickAddChannel);            
        }

        // Refresh the current group
        refreshCurrentGroup(polyChatModel) {
            document.querySelector("#current-group").innerText = polyChatModel.channelList[polyChatModel.currentGroupIndex].name;
        }

        // Add a new message to the conversation
        refreshConversation(polyChatModel) {
        let buffer = ``;
        const messages = polyChatModel.channelList[polyChatModel.currentGroupIndex].messages;
        const message = messages[messages.length - 1];
        const sender = message.sender;
        let date = new Date(message.timestamp);
        if(sender == polyChatModel.username) {
            buffer += ` <div class="message own-message">
                            <div class="text-message">${message.data}</div>
                            <div class="date">${date.toString().slice(0, 21)}</div>
                        </div>`;
        } else if(sender == "Admin") {
            buffer += ` <div class="admin-message">${message.data}</div>`;
        } else {
            buffer += ` <div class="message other-message">
                            <div class="sender">${sender}</div>
                            <div class="text-message">${message.data}</div>
                            <div class="date">${date.toString().slice(0, 21)}</div>
                        </div>`;
        }
        this.chatContainer.querySelector("#conversation").innerHTML += buffer;
        }

        // Refresh the group list
        refreshGroups(polyChatModel) {
            if (polyChatModel.channelList.length == 0) return;
            let notifs = polyChatModel.notifications.reduce(function(a, b) { return a + b; }, 0);
            if(notifs > 0) document.title = `(${notifs}) Polychat`;
            else document.title = `Polychat`;
            
            let context = this;
            let buffer = ``;
            // General channel
            buffer +=   `<div class="group smoke-background">
                            <i class="fas fa-star orange-icon"></i>
                            <div id="channel-0" class="group-text clickable">${polyChatModel.channelList[0].name} (défaut)</div>`;

            if(polyChatModel.notifications[0]){
                buffer += `<i class="far fa-bell notification-bell"></i><div class="notif-text">${polyChatModel.notifications[0]}</div>`;
            }
            buffer += `</div>`;

            // Other channel
            for(let i = 1; i < polyChatModel.channelList.length; ++i) {
                buffer +=   `<div class="group ${i % 2 ? "lightgray-background" : "smoke-background"}">
                                <i id="channelConnector-${i}" class="${polyChatModel.channelList[i].joinStatus ? "fa fa-minus orange-icon" : "fa fa-plus teal-icon"} clickable"></i>
                                <div id="channel-${i}" class="group-text clickable">${polyChatModel.channelList[i].name == "Général" ? "Géneral (défaut)" : polyChatModel.channelList[i].name}</div>`;
                if(polyChatModel.notifications[i]){
                    buffer += `<i class="far fa-bell notification-bell"></i><div class="notif-text">${polyChatModel.notifications[i]}</div>`;
                }
                buffer += `</div>`;
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
        renderModalUsername() {
            let buffer = ``;
            buffer += ` <div class="modal-content">
                            <div class="modal-header">
                                <span class="close">&times;</span>
                                <h3>Polychat</h3>
                            </div>
                            <div class="modal-body">
                                <div class = "name-input-header">Choisit ton nom d'utilisateur :</div>
                                <input id="name-input" name="name-input type="text"/>
                            </div>
                            <div class="modal-footer">
                                <div class="confirme-button small-info-text clickable" id="confirme-button">Confirmer</div>
                            </div>
                        </div>`;
            this.modalContainer.innerHTML = buffer;

            let closingButton = document.getElementsByClassName("close")[0];
            closingButton.onclick = function() {
                this.modalContainer.style.display = "none";
                this.modalContainer.innerHTML = ``;
            }.bind(this);

            window.onclick = function(event) {
                if (event.target == this.modalContainer) {
                    this.modalContainer.style.display = "none";
                    this.modalContainer.innerHTML = ``;
                }
            }.bind(this);
            this.modalContainer.style.display = "block";
            
            let confirmButton = this.modalContainer.querySelector(`#confirme-button`);
            confirmButton.addEventListener("click", this.changeUsername)
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
                this.view.onClickAddChannel = this.onClickAddChannel.bind(this);
                this.view.onClickSendThumbsUp = this.onClickSendThumbsUp.bind(this);
                this.view.changeUsername = this.changeUsername.bind(this);
                this.view.toggleMuteApplication = this.toggleMuteApplication.bind(this);

                this.setUsername();
                this.initializeConnectionHandler();
                this.view.renderView(this.model);
        }

        //Send a message to the current channel whenever the button is pressed.
        onClickSendMessage() {
            let message = this.view.chatContainer.querySelector("#message-input").value;
            if(message != "") {
                this.connectionHandler.sendMessage(message, this.model);
                this.view.chatContainer.querySelector("#message-input").value = "";
            }   
        }
        
        onClickSendThumbsUp() {
            this.connectionHandler.sendMessage(`\uD83D\uDC4D`, this.model);
        }

        onClickAddChannel() {
            let groupName = prompt("Entrer le nom du nouveau channel", "");
            this.connectionHandler.sendNewGroup(groupName);
        }

        setUsername() {
            let username = prompt("Entrer un nom d'utilisateur", "");
            this.model.username = username;
        }

        updateChannelList(list) {
            this.model.channelList.forEach(element => {
                if(list.findIndex(c => c.id === element.id) < 0) {
                    this.model.channelList.splice(element.id, 1);
                }
            });

            list.forEach(element => {
                if(this.model.channelList.findIndex(c => c.id === element.id) < 0) {
                    if(element.messages == null) {
                        element.messages = [];
                    }
                    this.model.channelList.push(element);
                    this.model.notifications.push(0);
                }
             });

             if(this.model.currentGroupIndex == null) {
                this.model.currentGroupIndex = 0;
                this.model.channelList[0].joinStatus = true;
                this.view.renderChat(this.model);
            }

             this.view.refreshGroups(this.model);
        }

        bulkMessage(data) {
            let index = this.model.channelList.findIndex(c => c.id === data.id);
            this.model.channelList[index].messages = data.messages;
            this.view.renderConversation(this.model);
        }

        changeCurrentGroup(event) { 
            const [, index] = event.currentTarget.id.split("-");
            if(!this.model.channelList[index].joinStatus) {
                this.toggleChannelConnection(event);
                this.connectionHandler.sendOnGetChannel(this.model.channelList[index].id);
            }
            this.model.currentGroupIndex = index;
            this.model.notifications[index] = 0;
            this.view.refreshCurrentGroup(this.model);
            this.view.refreshGroups(this.model);
            this.view.renderConversation(this.model);
        }

        changeUsername(event) {
            this.model = new PolyChatModel();
            let input = this.view.modalContainer.querySelector(`#name-input`).value;
            if(input != "")
            {
                this.model.username = input ;
                this.view.modalContainer.style.display = "none";
                this.view.modalContainer.innerHTML = ``;
                this.connectionHandler.disconnect();
                this.initializeConnectionHandler();
                this.view.renderView(this.model);
            }        
        }
        
        toggleChannelConnection(event) {
            const [, index] = event.currentTarget.id.split("-");
            if(index != 0) {
                let channel = this.model.channelList[index];
                this.connectionHandler.sendChannelConnection(channel.joinStatus, channel.id);
                //If we want to close the currentChannel, we change the currentChannel to "General"
                if(this.model.currentGroupIndex && channel.id == this.model.channelList[this.model.currentGroupIndex].id && channel.joinStatus) {
                    this.model.currentGroupIndex = 0;
                    this.view.refreshCurrentGroup(this.model);
                    this.view.renderConversation(this.model);
                }
                channel.joinStatus = !channel.joinStatus;
                this.model.notifications[index] = 0;
                this.view.refreshGroups(this.model);
            }
        }

        toggleMuteApplication(event) {
            this.model.applicationMute = !this.model.applicationMute;
            if(this.model.applicationMute) {
                event.currentTarget.classList.replace("notif-bell", "mute-bell");   
            }
            else {
                event.currentTarget.classList.replace("mute-bell", "notif-bell");
            }     
        }

        onNewMessage(cleanMessage) {
            let index = this.model.channelList.findIndex(c => c.id === cleanMessage.channelId);
            if(index >= 0 && this.model.channelList[index].joinStatus) { 
                this.model.channelList[index].messages.push(cleanMessage);                    
                if(index != this.model.currentGroupIndex) {
                    this.model.notifications[index]++;
                    if(!this.model.applicationMute){
                        this.model.notifSound.play();
                    }
                    this.view.refreshGroups(this.model);
                } else {
                    this.view.refreshConversation(this.model);
                }                                                   
            }
        }

        initializeConnectionHandler() {
            this.connectionHandler = new ConnectionHandler();
            this.connectionHandler.subscribe("updateChannelsList", updateChannelObserver.bind(this));
            this.connectionHandler.subscribe("onGetChannel", onGetChannelObserver.bind(this));
            this.connectionHandler.subscribe("onMessage", onMessage.bind(this) )
            this.connectionHandler.connect(`ws://inter-host.ca:3000/`, this.model.username);
        }
    }

    class PolyChatModel {
        constructor() {
            this.username = null;
            this.channelList = [];
            this.currentGroupIndex = null;
            this.notifications = [];
            this.applicationMute = false;
            this.notifSound = new Audio("roblox-death-sound-effect.mp3");
        }
    }

    // EntryPoint
    (async function() {
        let view = new PolyChatView();
        let model = new PolyChatModel();
        new PolyChatController(view, model);
        })();
