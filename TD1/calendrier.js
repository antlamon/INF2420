function check(img){
    img.src = "Images/tick-check.png";
    img.setAttribute("onclick", "uncheck(event.srcElement)");
    const value = img.id[5];
    document.getElementById("nb" + value).classList.add("selected-option");
    document.getElementById("dat" + value).classList.add("selected-option");
};

function uncheck(img){
    img.src = "Images/check.png";
    img.setAttribute("onclick", "check(event.srcElement)");
    const value = img.id[5];
    document.getElementById("nb" + value).classList.remove("selected-option");
    document.getElementById("dat" + value).classList.remove("selected-option");
};

let timeout;
function handlePopup(event){
    if (event.type == "mouseover"){
        timeout = setTimeout(showPopup, 1000, event);
    }
    else{
        clearTimeout(timeout);
        hidePopup(event);
    }
};

function showPopup(event){
    const id = event.srcElement.id;
    let popup = `<div id="popup"><div class="popup-date-time"><div class="popup-date">`;
    let dateTime = document.getElementById("dat" + id[7]);
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
    popup += document.getElementById("name" + id[6]).innerHTML;
    popup += `</span><span class="popup-voter-option">`;
    // Get vote option
    if (event.srcElement.className == "ticked-box"){
        popup += `Voted "Yes"`
    }
    else{
        popup += `Didn't vote for this`
    }
    popup += `</span></div>`;
    document.getElementById(id).innerHTML += popup;
}

function hidePopup(event){
    let popup = document.getElementById("popup");
    if (popup != null){
        let parent = popup.parentNode;
        parent.removeChild(popup);
    }
}