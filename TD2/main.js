 class PolyChatView {
     constructor() {
         this.usernameContainer = document.getElementById(`user`);
         this.chatContainer = document.getElementById(`chat-container`);
         this.groupContainer = document.getElementById(`group-container`);
        }
        
        renderView(polyChatModel) {
            this.changeUserName(polyChatModel);
            this.renderChat(polyChatModel);
            this.renderGroups(polyChatModel);
        }
        
        // Render the elements in the chat container
        renderChat(polyChatModel) {
            let buffer = ``;
            // chat header
            buffer +=   `<div class="container-header">
                            <div class="small-info-text">Groupe actif:</div>
                            <div class="info-text">${polyChatModel.currentGroup != null ? polyChatModel.currentGroup : "Veuillez selectionner un groupe"}</div>
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
                                    <i class="fa fa-plus" id="add-group"></i>
                                    <i class="fa fa-cog" id="group-options"></i>
                                </div>
                            </div>
                        </div>`;
            // groups list container
            buffer +=   `<div class="scrollable-container" id="groups"></div>`;
                        
            this.groupContainer.innerHTML = buffer;
        }
        
        changeUserName(polyChatModel) {
            this.usernameContainer.innerText = polyChatModel.user.username;
        }

        refreshConversation(polyChatModel) {

        }

        refreshGroups(polyChatModel) {
            let groupsContainer = document.getElementById("groups");
            let buffer = ``;
            for(let i = 0; i < polyChatModel.channelList.length; ++i) {
                buffer +=   `<div class="group ${i % 2 ? "lightgray-background" : "smoke-background"}">
                                <i class="${polyChatModel.channelList[i].name == "Général" ? "fas fa-star" : "fa fa-plus"} ${polyChatModel.channelList[i].joinStatus ? "orange-icon" : "teal-icon"}"></i>
                                <div class="group-text">${polyChatModel.channelList[i].name == "Général" ? "Géneral (défaut)" : polyChatModel.channelList[i].name}</div>
                            </div>`;
            }
            groupsContainer.innerHTML = buffer;
        }
    }
    
    class PolyChatController {
            constructor(polyChatView, polyChatModel){
            this.view = polyChatView;
            this.model = polyChatModel;
            this.view.renderView(this.model);
            }

            updateChannelList(list) {
             // Need to filter the list and add the missing item not a bonobo assignation like this. ONLY TEMP
             this.model.channelList = list;
             this.view.refreshGroups(this.model);
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
        let controller = new PolyChatController(view, model);

        
        this.connectionHandler = new ConnectionHandler(`ws://inter-host.ca:3000/`, "VarCestLet");
        this.connectionHandler.subscribe("updateChannelsList", channelsObserver.bind(controller));
        })();
