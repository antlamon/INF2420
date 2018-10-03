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
function handlePopper(event){
    console.log(event);
    if (event.type == "mouseover"){
        timeout = setTimeout(showPopper, 1000, event);
    }
    else{
        clearTimeout(timeout);
    }
};

function showPopper(event){
    console.log("ShowingPopper")
    const id = event.path[event.path.length - 6].id;
    //document.getElementById(id).innerHTML += '<span class="popuptext" id="myPopup">A Simple Popup!</span>';
    console.log(id);
}