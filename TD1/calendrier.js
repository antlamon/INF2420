function check(value){
    document.getElementById("check" + value).innerHTML = `<img src="Images/tick-check.png" alt="check box" onclick="uncheck(${value})"/>`;
    document.getElementById("nb" + value).style.background = "#ebf7d4";
    document.getElementById("dat" + value).style.background = "#ebf7d4";
};

function uncheck(value){
    document.getElementById("check" + value).innerHTML = `<img src="Images/check.png" alt="check box" onclick="check(${value})"/>`;
    document.getElementById("nb" + value).style.background = "white";
    document.getElementById("dat" + value).style.background = "white";
};