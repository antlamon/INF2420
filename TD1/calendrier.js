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