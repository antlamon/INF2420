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
            buffer +=   `<div id="conversation"></div>`

            // message input container
            buffer +=   `<div class="input-container">
                            <i class="far fa-thumbs-up" id="like-button"></i>
                            <input id="message-input" name="message-input type="text" placeholder="Votre message ici"/>
                            <div class="small-info-text" id="send-button">Envoyer</div>
                        </div>`
            }
                            
            this.chatContainer.innerHTML = buffer;
            this.refreshConversation(polyChatModel);
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
                        
            // group list
            this.groupContainer.innerHTML = buffer;
        }
        
        changeUserName(polyChatModel) {
            this.usernameContainer.innerText = polyChatModel.username;
        }

        refreshConversation(polyChatModel) {

        }
    }
    
    class PolyChatController {
            constructor(polyChatModel, polyChatView){
            this.view = polyChatView;
            this.model = polyChatModel;
            this.polyChatView.renderView(this.polyChatModel);
            }

            updateChannelList(list) {
            
            }
    }

    class PolyChatModel {
        constructor() {
            this.user = {
                username = "Guest",
                connectedChannel = []
            };
            this.channelList = [];
        }
    }

    // EntryPoint
    (async function() {
        let view = new PolyChatView();
        let model = new PolyChatModel();
        model.changeUserName("Guest");
        let controller = new PolyChatController(view, model);

        
        this.connectionHandler = new ConnectionHandler(`ws://inter-host.ca:3000/`, "VarCestLet");
        this.connectionHandler.subscribe("updateChannelsList", view.renderView.bind(view));
        this.connectionHandler.subscribe("onMessage", view.renderView.bind(view));
        })();