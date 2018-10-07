//Controller
var DoodleController = function DoodleController(doodleView, doodleModel) {
    this.doodleView = doodleView;
    this.doodleModel = doodleModel;
 };
 
 DoodleController.prototype.initialize = function initialize() {
    this.doodleView.onClickShowCalendar = this.onClickShowCalendar.bind(this);
    this.doodleView.onClickShowTable = this.onClickShowTable.bind(this);
    this.doodleView.handlePopup = this.handlePopup.bind(this);
    this.doodleView.toggleDisponibility = this.toggleDisponibility.bind(this);
    this.doodleView.changeCurrentParticipant = this.changeCurrentParticipant.bind(this);
    this.doodleView.changeCurrentName = this.changeCurrentName.bind(this);
    this.doodleView.updateCurrentParticipant = this.updateCurrentParticipant.bind(this);
    this.doodleView.renderCalendar(this.doodleModel);
 };
 
 DoodleController.prototype.onClickShowCalendar = function onClickShowCalendar(event) {
    this.doodleView.renderCalendar(this.doodleModel);
 };
 
 
 DoodleController.prototype.onClickShowTable = function onClickShowCalendar(event) {
    this.doodleView.renderTable(this.doodleModel);
 };
 
 DoodleController.prototype.changeCurrentName = function changeCurrentName(event) {
    this.doodleModel.currentParticipant.name = event.currentTarget.value;
 }

DoodleController.prototype.toggleDisponibility = function toggleDisponibility(event) {
    const [, rowIndex, colIndex] = event.srcElement.id.split('-');
    this.doodleModel.currentParticipant.disponibility[colIndex] = !this.doodleModel.currentParticipant.disponibility[colIndex];
    this.doodleView.renderCalendar(this.doodleModel);
}

DoodleController.prototype.changeCurrentParticipant = function changeCurrentParticipant(event) {
    const [, rowIndex] = event.currentTarget.id.split('-');
    this.doodleModel.participants = this.doodleModel.participants.map((p, index) => { 
        if(!p.status) {
            p.status = 1;
        }
        if(index == rowIndex) {
            p.status = 0;
        }
        return p;
    })
    this.doodleModel.currentParticipant = {...this.doodleModel.participants[rowIndex], disponibility: [...this.doodleModel.participants[rowIndex].disponibility] , status:0};
    this.doodleView.renderCalendar(this.doodleModel);
}

DoodleController.prototype.updateCurrentParticipant = function updateCurrentParticipant(event) {
    
    var rowIndex;
    this.doodleModel.participants.forEach( (p, index) => {
        if(!p.status) {
            rowIndex = index;
        }
    })
    this.doodleModel.participants[rowIndex] = {...this.doodleModel.currentParticipant, disponibility: [...this.doodleModel.currentParticipant.disponibility], status:1};
    this.doodleModel.currentParticipant = null;
    this.doodleView.renderCalendar(this.doodleModel);
}
 
 let timeout;
 DoodleController.prototype.handlePopup = function handlePopup(event) {
    if (event.type == "mouseover"){
        timeout = setTimeout(showPopup, 1000, event);
    }
    else{
        clearTimeout(timeout);
        hidePopup(event);
    }
 };
 
 function showPopup(event){
    
    const [, rowIndex, colIndex] = event.srcElement.id.split('-');
    let popup = `<div id="popup"><div class="popup-date-time"><div class="popup-date">`;
    let dateTime = document.getElementById("dat-" + colIndex);
    // Get the month
    popup += dateTime.childNodes[1].outerHTML;
    // Get the date
    popup += dateTime.childNodes[3].outerHTML;
    // Get the day
    popup += dateTime.childNodes[5].outerHTML;
    popup += `</div><div class="popup-time">`;
    // Get the time
    popup += dateTime.childNodes[7].innerHTML;
    popup += `</div></div><div class="popup-vote"><span class="popup-voter">`;
    // Get voter name
    popup += document.getElementById("name-" + rowIndex).innerHTML;
    popup += `</span><span class="popup-voter-option">`;
    // Get vote option
    if (event.srcElement.classList.contains("ticked-box")){
        popup += `Voted "Yes"`
    }
    else{
        popup += `Voted "No" for this`
    }
    popup += `</span></div>`;
    event.srcElement.innerHTML += popup;
 }
 
 function hidePopup(event){
    let popup = document.getElementById("popup");
    if (popup != null){
        let parent = popup.parentNode;
        parent.removeChild(popup);
    }
 }
 
 //View 
 var DoodleView = function DoodleView(element) {
    this.element = element;
    this.onClickShowCalendar = null;
    this.onClickShowTable = null;
    this.handlePopup = null;
    this.toggleDisponibility = null;
    this.changeCurrentParticipant = null;
    this.changeCurrentName = null;
    this.updateCurrentParticipant = null;
 };
 
 function withLeadingZero(number) {
    return `${number < 10 ? '0':''}${number}`
 }

 function IsCurrentParticipantInParticipants(doodleModel) {
    var isSame = true;
    doodleModel.participants.forEach((p) => {
        if(!p.status) {
            if( doodleModel.currentParticipant && p.name == doodleModel.currentParticipant.name) {
                p.disponibility.forEach((dispo, index) => { 
                    if(dispo != doodleModel.currentParticipant.disponibility[index]) {
                        isSame = false;
                    }
                })
            }
            else
                isSame = false;
        }
    });

    return isSame;
 }

 DoodleView.prototype.renderCalendar = function renderCalendar(doodleModel) {
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var dayOfTheWeek = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    var buffer ='';
    buffer += `<div class="sondage-doodle" id="sondage">`;
    buffer += doodleModel.dateTimes.reduce(function(accumulator, date, index){
        return accumulator + `<div class="date-and-time${doodleModel.currentParticipant && doodleModel.currentParticipant.disponibility[index] ? " selected-option":""}" id="dat-${index}">
                                <div class="month">${months[date.dateTime.getMonth()]}</div>
                                <div class="date">${date.dateTime.getDate()}</div>
                                <div class="day-of-the-week">${dayOfTheWeek[date.dateTime.getDay()]}</div>
                                <div class="time">
                                    <div class="start-time">${date.dateTime.getHours()+':'+ withLeadingZero(date.dateTime.getMinutes())}</div>
                                    <div class="end-time">${`${date.dateTime.getHours()+Math.floor(date.duration/60)}:${withLeadingZero(date.dateTime.getMinutes()+date.duration%60)}`}</div>
                                </div>
                            </div>`
    }, '<div class="date-and-time"></div>')
    buffer += doodleModel.dateTimes.reduce(function(accumulator, date, index){
        return accumulator + `<div class="nb-participant${doodleModel.currentParticipant && doodleModel.currentParticipant.disponibility[index] ? " selected-option":""}" id="nb-${index}">
                                  <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                                  <span class="colored-number">${                      
                                        doodleModel.participants.reduce(function(count, participant){
                                            return count + participant.disponibility[index];
                                        },0)
                                    }</span>
                              </div>`
    },`<div class="participant-header"><span class=participants>${doodleModel.participants.length} participants</span></div>`)

    buffer += doodleModel.participants.reduce(function(accumulator, participant, index) {
        if(!participant.status && doodleModel.currentParticipant)
        {
            return accumulator + doodleModel.currentParticipant.disponibility.reduce(function(row, dispo, indexDate) {
                         if(dispo) {
                            return row + `<div class="check"><img src="Images/tick-check.png" id="check-${index}-${indexDate}" alt="check box" /></div>`;
                         }
                         else {
                            return row + `<div class="check"><img src="Images/check.png" id="check-${index}-${indexDate}" alt="uncheck box"/></div>`;
                         }
                    },`<div class="new-participant"><img class="avatar" src="Images/particip1.png" alt="blue avatar"/><input type="text" value=${doodleModel.currentParticipant.name} placeholder="Enter your name"/></div>`);
        }
        else
        {
            return accumulator + participant.disponibility.reduce(function(row, dispo, indexDate) {
                if(dispo) {
                    return row + `  <div id="choice-${index}-${indexDate}" class="box ticked-box">
                                        <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                                    </div>`;
                }
                else {
                   return row + `   <div id="choice-${index}-${indexDate}" class="box not-ticked-box"></div>`;
                }
           },   `<div class="participant">
                    <img class="avatar" src="Images/particip2.png" alt="grey avatar" /><span class="nom-participant" id="name-${index}">${participant.name}</span>
                    <div class="pen-container" id="pen-${index}">
                        <svg class="pen" aria-hidden="true" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>
                    </div>
                </div>`);
        }
    },'')
    buffer += `</div>`;
    if(doodleModel.currentParticipant) {
        var buttonValue = IsCurrentParticipantInParticipants(doodleModel)? "Annuler":"Mettre à jour";
        var nbCheck = doodleModel.currentParticipant.disponibility.filter(Boolean).length;
        buffer += `<div class="finish-button">`;
        if(nbCheck > 0) {
            buffer += ` <svg aria-hidden="true" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                        <span>${nbCheck}</span>`;
        }
        buffer += `     <button class="finish-button">${buttonValue}</button>
                    </div>`;
    }
    this.element.innerHTML = buffer;
    var boxes = this.element.querySelectorAll(".box");
    var context = this;
    boxes.forEach(function(box){
        box.addEventListener("mouseover", context.handlePopup);
        box.addEventListener("mouseout", context.handlePopup);
    })

    var checks = this.element.querySelectorAll(".check");
    checks.forEach(function(check){
        check.addEventListener("click", context.toggleDisponibility);
    })
    var pens = this.element.querySelectorAll(".pen-container");
    pens.forEach(function(pen){
        pen.addEventListener("click", context.changeCurrentParticipant);
    })
    if(doodleModel.currentParticipant){
        this.element.querySelector("input").addEventListener("keyup", context.changeCurrentName);
    }

    this.element.querySelector(".finish-button").addEventListener("click", context.updateCurrentParticipant);
 };

 DoodleView.prototype.renderTable = function renderTable(viewModelData) {
    this.element.innerHTML = '';
   
    // Wire up click events, and let the controller handle events
 
 };
 
 //Model
 var DoodleModel = function DoodleModel() {
    this.participants = [];
    this.dateTimes = [];
    this.currentParticipant;
 };
 
 DoodleModel.prototype.initialize = async function initialize() {

    var response = await fetch("http://localhost:8080/cal-data.json");
    var data = await response.json();
 
    this.participants = data["Participants"].map(participant => {
        var currentParticipant =  {
                name: participant.Nom,
                status: participant.Statut == 'Complété'? 1:0,
                disponibility: participant.Disponibilités
            }
        if(!currentParticipant.status) {
            this.currentParticipant = {...currentParticipant, disponibility: [...currentParticipant.disponibility]};
        }
        return currentParticipant;
    })
    this.dateTimes = data["Calendrier"].map(date => {
        return { 
            dateTime: new Date(date[0]),
            duration: date[1]
        };
    })

 };
 
 
 
 
 //Entry Point :
 (async function() {
    var model = new DoodleModel();
    await model.initialize();
    var targetElement = document.getElementById('grid-container');
    var view = new DoodleView(targetElement);
 
    var controller = new DoodleController(view,model);
    controller.initialize();
 })();
 