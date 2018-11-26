// PolyChatView that contains all the views of our application. 
class PolyChatView {
    constructor() {
        // Containers
        this.chatContainer = document.getElementById(`chat-container`);
        this.groupContainer = document.getElementById(`group-container`);
        this.headerOptionsContainer = document.getElementById(`header-options`);
        this.modalContainer = document.getElementById(`modal-container`);

        // Events
        this.onClickSendMessage = null;
        this.changeCurrentGroup = null;
        this.onClickAddChannel = null;
        this.onClickSendThumbsUp = null;
        this.changeUsername = null;
        this.toggleMuteApplication = null;
        this.resetNotifs = null;
    }
    
    // Render the header and the containers containing the conversation and the groups.
    renderView(polyChatModel) {
        this.renderHeaderOptions(polyChatModel);
        this.renderChat(polyChatModel);
        this.renderGroups(polyChatModel);
    }
    
    // Render the header where you can find the options of PolyChat.
    renderHeaderOptions(polyChatModel){
        let buffer = ``;
        buffer += ` <div class="clickable" id="user-option">
                        <i class="far fa-user"></i>
                        <div id="user">${polyChatModel.username}</div>
                    </div>
                    <div class="notif-options">
                        <i class="fas fa-bell clickable" id="notif-bell-picture"></i>
                        <div id="notif-bell"></div>
                    </div>
                    <i class="fas fa-volume-up clickable" id="speaker"></i>
                    <i class="fa fa-cog clickable" id="options"></i>`;

        this.headerOptionsContainer.innerHTML = buffer;

        // Event to change the current username
        const user = document.querySelector("#user-option");
        user.addEventListener("click", function() {
            this.renderModalWithInput("Veuillez choisir un nouveau nom d'utilisateur : ", this.changeUsername.bind(this), true)
        }.bind(this));

        // Event to remove the all notifications
        const bell = document.querySelector("#notif-bell-picture");
        bell.addEventListener("click", this.resetNotifs);                
        
        // Event to mute the sound of the notifications
        const speaker = document.querySelector("#speaker")
        speaker.addEventListener("click", this.toggleMuteApplication)
    }
    
    // Render the elements in the chat container.
    renderChat(polyChatModel) {
        let context = this;
        let buffer = ``;
        // Chat header
        buffer +=   `<div class="container-header">
                        <div class="small-info-text">Groupe actif:</div>
                        <div id="current-group" class="info-text">${polyChatModel.channelList[polyChatModel.currentGroupIndex] != null ? polyChatModel.channelList[polyChatModel.currentGroupIndex].name : "Général"}</div>
                    </div>`;
        // Conversation container
        buffer +=   `<div class="scrollable-container" id="conversation"></div>`;

        // Message input container
        buffer +=   `<div class="input-container">
                        <i class="far fa-thumbs-up clickable" id="like-button"></i>
                        <input id="message-input" name="message-input type="text" placeholder=" Votre message ici"/>
                        <div class="small-info-text clickable" id="send-button">Envoyer</div>
                    </div>`;          

        this.chatContainer.innerHTML = buffer;

        // Event to send a message into the chat from the button
        const sendButton = this.chatContainer.querySelector("#send-button");
        sendButton.addEventListener("click", context.onClickSendMessage);

        // Event to send a message into the chat from enter key.
        document.addEventListener("keydown", function(event) {
            //Enter key
            if (event.keyCode === 13) {
                document.getElementById("send-button").click();
            }
        });
        const thumbsUpButton = this.chatContainer.querySelector("#like-button");
        thumbsUpButton.addEventListener("click", context.onClickSendThumbsUp);
    }

    // Render the conversation on joining the channel.
    renderConversation(polyChatModel) {
        let buffer = ``;
        polyChatModel.channelList[polyChatModel.currentGroupIndex].messages.forEach(message => {
            const sender = message.sender;
            let date = new Date(message.timestamp);
            if(sender == polyChatModel.username) {
                // Render own messages
                buffer += ` <div class="message own-message">
                                <div class="text-message">${message.data}</div>
                                <div class="date">${date.toString().slice(0, 21)}</div>
                            </div>`;
            } else if(sender == "Admin") {
                // Render admin messages
                buffer += ` <div class="admin-message">${message.data}</div>`;
            } else {
                // Render other messages
                buffer += ` <div class="message other-message">
                                <div class="sender">${sender}</div>
                                <div class="text-message">${message.data}</div>
                                <div class="date">${date.toString().slice(0, 21)}</div>
                            </div>`;
            }
        });
        let conversation = this.chatContainer.querySelector("#conversation");
        conversation.innerHTML = buffer;
        conversation.scrollTop = conversation.scrollHeight;
    }
    
    // Render the elements in the group container.
    renderGroups(polyChatModel) {
        let buffer = ``;
        let context = this;
        // Group header
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
        // Groups list container
        buffer +=   `<div class="scrollable-container" id="groups"></div>`;
                    
        this.groupContainer.innerHTML = buffer;
        const addGroupButton = this.groupContainer.querySelector("#add-group");
        addGroupButton.addEventListener("click", function() {
            this.renderModalWithInput("Veuillez entrer le nom du nouveau channel : ", this.onClickAddChannel.bind(this), true)
        }.bind(this));          
    }

    // Refresh the current group.
    refreshCurrentGroup(polyChatModel) {
        document.querySelector("#current-group").innerText = polyChatModel.channelList[polyChatModel.currentGroupIndex].name;
    }

    // Add a new message to the conversation.
    refreshConversation(polyChatModel) {
        let buffer = ``;
        const messages = polyChatModel.channelList[polyChatModel.currentGroupIndex].messages;
        const message = messages[messages.length - 1];
        const sender = message.sender;
        let date = new Date(message.timestamp);
        if(sender == polyChatModel.username) {
            // Own messages
            buffer += ` <div class="message own-message">
                            <div class="text-message">${message.data}</div>
                            <div class="date">${date.toString().slice(0, 21)}</div>
                        </div>`;
        } else if(sender == "Admin") {
            // Admin messages
            buffer += ` <div class="admin-message">${message.data}</div>`;
        } else {
            // Other messages
            buffer += ` <div class="message other-message">
                            <div class="sender">${sender}</div>
                            <div class="text-message">${message.data}</div>
                            <div class="date">${date.toString().slice(0, 21)}</div>
                        </div>`;
        }
        let conversation = this.chatContainer.querySelector("#conversation");
        conversation.innerHTML += buffer;
        conversation.scrollTop = conversation.scrollHeight;
    }

    // Refresh the group list.
    refreshGroups(polyChatModel) {
        if (polyChatModel.channelList.length == 0) return;

        // Render the notification bell number
        let notifBell = document.querySelector("#notif-bell");
        let notifs = polyChatModel.channelList.reduce(function(a, b) { return a + b.notification; }, 0);
        if(notifs > 0) {
            document.title = `(${notifs}) Polychat`;
            notifBell.innerHTML = notifs;
        }
        else {
            document.title = `Polychat`;
            notifBell.innerHTML = "";
        }

        // Render the groups in the group container
        let context = this;
        let buffer = ``;
        // General channel
        buffer +=   `<div class="group smoke-background">
                        <i class="fas fa-star orange-icon"></i>
                        <div id="channel-0" class="group-text clickable">${polyChatModel.channelList[0].name} (défaut)</div>`;

        // Add a notification if there are new messages in a joined channel
        if(polyChatModel.channelList[0].notification){
            buffer += ` <div>
                            <i class="far fa-bell notification-bell"></i>
                            <div class="notif-text">${polyChatModel.channelList[0].notification}</div>
                        </div>`;
        }
        buffer += `</div>`;

        // Other channels
        for(let i = 1; i < polyChatModel.channelList.length; ++i) {
            buffer +=   `<div class="group ${i % 2 ? "lightgray-background" : "smoke-background"}">
                            <i id="channelConnector-${i}" class="${polyChatModel.channelList[i].joinStatus ? "fa fa-minus orange-icon" : "fa fa-plus teal-icon"} clickable"></i>
                            <div id="channel-${i}" class="group-text clickable">${polyChatModel.channelList[i].name == "Général" ? "Géneral (défaut)" : polyChatModel.channelList[i].name}</div>`;

                // Add a notification if there are new messages in a joined channel
                if(polyChatModel.channelList[i].notification){
                buffer += ` <div>
                                <i class="far fa-bell notification-bell"></i>
                                <div class="notif-text">${polyChatModel.channelList[i].notification}</div>
                            </div>`;
            }
            buffer += `</div>`;
        }
        this.groupContainer.querySelector("#groups").innerHTML = buffer;
        // Set the events to change the current group
        const channels = this.groupContainer.querySelectorAll(`[id^="channel-"]`);
        channels.forEach(channel => {
            channel.addEventListener("click", context.changeCurrentGroup);
        });

        // Set the events to join a new channel
        const channelConnectors = this.groupContainer.querySelectorAll(`[id^="channelConnector"]`);
        channelConnectors.forEach(channelConnector => {
            channelConnector.addEventListener("click", context.toggleChannelConnection)
        });
    }
    
    // Render a modal with an input box in the middle of the screen.
    renderModalWithInput(innerText, callbackFunc, canBeClose) {
        let buffer = ``;
        buffer += ` <div class="modal-content">
                        <div class="modal-header">
                            ${canBeClose ? `<span class="close">&times;</span>`: ``}
                            <h3>Polychat</h3>
                        </div>
                        <div class="modal-body">
                            <div class="name-input-header">${innerText} </div>
                            <input id="name-input" name="name-input" type="text"/>
                        </div>
                        <div class="modal-footer">
                            <div class="confirm-button small-info-text clickable" id="confirm-button">Confirmer</div>
                        </div>
                    </div>`;
        this.modalContainer.innerHTML = buffer;

        // If the user can close the modal without inserting text in the input box
        if(canBeClose) {
            // Event to close the modal by clicking on the X button.                                                
            let closingButton = document.getElementsByClassName("close")[0];
            closingButton.onclick = function(event) {
                event.stopPropagation();
                this.modalContainer.style.display = "none";
                this.modalContainer.innerHTML = ``;
            }.bind(this);

            // Event to close the modal by clicking outside the modal box.
            window.onclick = function(event) {
                event.stopPropagation();
                if (event.target == this.modalContainer) {
                    this.modalContainer.style.display = "none";
                    this.modalContainer.innerHTML = ``;
                }
            }.bind(this);
        }
        this.modalContainer.style.display = "block";

        // Focus on the input box        
        document.querySelector("#name-input").focus();

        // Event to confirm by clicking on the enter key
        this.modalContainer.addEventListener("keydown", function(event) {
            // Enter key
            if (event.keyCode === 13) {
                let button = this.modalContainer.querySelector("#confirm-button");
                if(button) button.click();
            }
        }.bind(this));            

        // Event to confirm by clicking on the confirm button
        let confirmButton = this.modalContainer.querySelector("#confirm-button");
        confirmButton.addEventListener("click", callbackFunc);
    }

    // Refresh the input in a modal in case of error.    
    refreshInputInModal(placeholder) {
        let input = document.querySelector("#name-input");
        input.value = "";                                
        input.placeholder = placeholder;
        input.focus();                                            
    }    

    // Render a modal for the error coming from the server/websocket or from the application.
    renderErrorModal(error) {
        let buffer = ``;
        buffer += ` <div class="modal-content">
                        <div class="modal-header">
                                <span class="close">&times;</span>
                            <h3>Polychat Erreur</h3>
                        </div>
                        <div class="modal-body">
                            <div class="name-input-header">${error}</div>
                        </div>
                        <div class="modal-footer"></div>
                    </div>`;
        this.modalContainer.innerHTML = buffer;

        // Event to close the modal by clicking on the X button.        
        let closingButton = document.getElementsByClassName("close")[0];
        closingButton.onclick = function(event) {
            event.stopPropagation();
            this.modalContainer.style.display = "none";
            this.modalContainer.innerHTML = ``;
        }.bind(this);

        this.modalContainer.style.display = "block";
    }
}




// PolyChatController handle the events received by the application.
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
            this.view.resetNotifs = this.resetNotifs.bind(this);

            this.view.renderModalWithInput("Veuillez choisir votre nom d'utilisateur : ", this.setUsername.bind(this));
    }

    // Sends a message to the current channel whenever the button or the enter key is pressed.
    onClickSendMessage() {
        let message = this.view.chatContainer.querySelector("#message-input").value;
        // Only if the input box isn't empty                
        if(message != "") {
            this.connectionHandler.sendMessage(message, this.model);
            this.view.chatContainer.querySelector("#message-input").value = "";
        }   
    }
    
    // Sends a thumbsUp.    
    onClickSendThumbsUp() {
        this.connectionHandler.sendMessage(`\uD83D\uDC4D`, this.model);
    }

    // Adds a new channel to the server.
    onClickAddChannel() {
        let input = this.view.modalContainer.querySelector(`#name-input`).value;
        if(input.length > 0) {
            this.connectionHandler.sendNewChannel(input);
            this.view.modalContainer.style.display = "none";
            this.view.modalContainer.innerHTML = ``;
        }
    }

    // Resets the notification on all channel.    
    resetNotifs() {
        this.model.channelList.forEach(function(channel, i, channelList) {
            channelList[i].notification = 0;
        });
        this.view.refreshGroups(this.model);
    }    
    
    // Set the username of a user to start the chat service.
    setUsername() {
        let input = this.view.modalContainer.querySelector("#name-input").value;
        // Checks if the username length is valid
        if(input.length >=3 && input.length <= 15) {
            this.model.username = input;
            this.initializeConnectionHandler();
            this.view.modalContainer.style.display = "none";
            this.view.modalContainer.innerHTML = ``;
            this.view.renderView(this.model);
        } else {
            this.view.refreshInputInModal("Entre 3 et 15 caractères svp!");
        }
    }

    // Updates the channels with a list coming from the observer watching the updateChannelsList websocket event.
    updateChannelList(list) {
        // Removes all the deleted channels to the list                        
        this.model.channelList.forEach(element => {
            let index;
            if((index = list.findIndex(c => c.id === element.id)) < 0) {                
                this.model.channelList.splice(index, 1);
            }
        });

        // Adds all the new channels to the list
        list.forEach(element => {
            if(this.model.channelList.findIndex(c => c.id === element.id) < 0) {
                if(element.messages == null) {
                    element.messages = [];
                    element.notification = 0;
                }
                this.model.channelList.push(element);
            }
        });

        // Always connects to the General channel
        if(this.model.currentGroupIndex == null) {
            this.model.currentGroupIndex = 0;
            this.model.channelList[0].joinStatus = true;
            this.view.renderChat(this.model);
        }

        // Referesh the view of the groups
        this.view.refreshGroups(this.model);
    }

    // Add messages received by onGetChannel to the right channel.    
    bulkMessage(data) {
        let index = this.model.channelList.findIndex(c => c.id === data.id);
        this.model.channelList[index].messages = data.messages;
        this.view.renderConversation(this.model);
    }

    // Changes the current group assigned to the user.                            
    changeCurrentGroup(event) { 
        let [, index] = event.currentTarget.id.split("-");
        // Gets the message on a channel if the user is joining it.
        if(!this.model.channelList[index].joinStatus) {
            let channelId = this.model.channelList[index].id;
            this.toggleChannelConnection(event);
            index = this.model.channelList.findIndex(c => c.id === channelId);
            this.connectionHandler.sendOnGetChannel(this.model.channelList[index].id);
        }
        this.model.currentGroupIndex = index;
        this.model.channelList[index].notification = 0;
        this.view.refreshCurrentGroup(this.model);
        this.view.refreshGroups(this.model);
        this.view.renderConversation(this.model);
    }

    // Changes the current username and recreates a new session.            
    changeUsername(event) {
        let input = this.view.modalContainer.querySelector(`#name-input`).value;
        //If the input name is valid        
        if(input.length >=3 && input.length <= 15)
        {   
            this.model = new PolyChatModel();
            this.model.username = input ;
            this.view.modalContainer.style.display = "none";
            this.view.modalContainer.innerHTML = ``;
            //Disconnect the previous user and reinitialize the connectionHandler with the new username
            this.connectionHandler.disconnect();
            this.initializeConnectionHandler();
            this.view.renderView(this.model);
        }  
        else 
        {
            this.view.renderErrorModal("Le nom d'utilisateur entré n'est pas entre 3 et 15 caractères.")
        }      
    }
    
    // Changes the joinStatus of the user on a channel.        
    toggleChannelConnection(event) {
        // Gets the index of the channel to toggle        
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
            this.model.channelList[index].notification = 0;
            // Sort the channelList if the user is connected to them or not 
            this.model.channelList.sort(this.model.compare);
            // Render the view
            this.view.refreshGroups(this.model);
        }
    }
    // Changes the value to allow or not the sound of the notifications.                            
    toggleMuteApplication(event) {
        this.model.applicationMute = !this.model.applicationMute;
        if(this.model.applicationMute) { 
            event.currentTarget.classList.replace("fa-volume-up", "fa-volume-mute");
        }
        else {
            event.currentTarget.classList.replace("fa-volume-mute","fa-volume-up");
        }     
    }

    // Receives a new message to add the the specific channel.
    onNewMessage(cleanMessage) {
        let index = this.model.channelList.findIndex(c => c.id === cleanMessage.channelId);
        // Checks if the message is from a joined channel.
        if(index >= 0 && this.model.channelList[index].joinStatus) { 
            this.model.channelList[index].messages.push(cleanMessage);  
            // Adds a notifications if the message is not in the current group                  
            if(index != this.model.currentGroupIndex) {
                this.model.channelList[index].notification++;
                if(!this.model.applicationMute){
                    this.model.notifSound.play();
                }
                this.view.refreshGroups(this.model);
            } else {
                this.view.refreshConversation(this.model);
            }                                                   
        }
    }

    // Prompt the error modal whenever the observer receive an error event.
    onNewError(error) {
        this.view.renderErrorModal(error);
    }

    // Initialize the connection handler and subscribe the observers to some events.
    initializeConnectionHandler() {
        this.connectionHandler = new ConnectionHandler();
        this.connectionHandler.subscribe("updateChannelsList", updateChannelObserver.bind(this));
        this.connectionHandler.subscribe("onGetChannel", onGetChannelObserver.bind(this));
        this.connectionHandler.subscribe("onMessage", onMessage.bind(this));
        this.connectionHandler.subscribe("onError", onErrorObserver.bind(this));
        this.connectionHandler.connect(`ws://log2420-nginx.info.polymtl.ca/`, this.model.username);
    }
}




// The model that holds the data for our application.
class PolyChatModel {
    constructor() {
        this.username = null;
        this.channelList = [];
        this.currentGroupIndex = null;
        this.applicationMute = false;
        this.notifSound = new Audio("roblox-death-sound-effect.mp3");
    }
//
    // Compare the elements with the boolean if the user is connected to them or not.
    compare(a, b) {
        return b.joinStatus - a.joinStatus;                        
    }
}




// EntryPoint
(async function() {
    let view = new PolyChatView();
    let model = new PolyChatModel();
    new PolyChatController(view, model);
})();
