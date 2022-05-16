// Jackson Hagood | jacksonhagood.com

function changeTheme() {
    if (document.getElementsByTagName("link")[0].getAttribute("href") == "CSS/A.css") {
        document.getElementsByTagName("link")[0].setAttribute("href", "CSS/B.css"); 
        localStorage.setItem("sheet", "CSS/B.css");
    } else if (document.getElementsByTagName("link")[0].getAttribute("href") == "CSS/B.css") { 
        document.getElementsByTagName("link")[0].setAttribute("href", "CSS/C.css"); 
        localStorage.setItem("sheet", "CSS/C.css");
    } else {
        document.getElementsByTagName("link")[0].setAttribute("href", "CSS/A.css"); 
        localStorage.setItem("sheet", "CSS/A.css");
    }
}

window.onload = function() {
    document.getElementsByTagName("link")[0].setAttribute("href", "CSS/A.css");
    
    if (localStorage.getItem("sheet") == "CSS/B.css" || localStorage.getItem("sheet") == "CSS/C.css") {
        document.getElementsByTagName("link")[0].setAttribute("href", localStorage.getItem("sheet"));
    }
}