const { connect } = require("tls");

var output = document.querySelector("#output"),
    textarea = document.querySelector("textarea"),
    connected = false,
    connected_to = document.querySelector("div.websocket textarea").value;
var send = document.getElementById('send_id');
var output = document.getElementById('out_id');

connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + connected_to + "<br></p>");

function onClickButton_connect() {
    var cnd_2 = document.getElementById('cnd_stat_2');
    if (connected == true) {
        onClickButton_disconnect();
    }
    if (connected == false) {
        send.insertAdjacentHTML("afterbegin", "<textarea cols=60 rows=6 id='send_id2'></textarea><button onclick='onClickButton_send();' id='send_id3'>send</button>");
        connected = true;
        cnd_2.remove();
        connected_to = document.querySelector("div.websocket textarea").value;
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + connected_to + "<br></p>");
    }
    console.log(connected_to);
}

function doSend(message) {
    //ws.send(message);
    console.log('sent: %s', message)
    writeToScreen("SENT: " + message);
}

function onClickButton_disconnect() {
    var send3 = document.getElementById('send_id3'); 
    var send2 = document.getElementById('send_id2'); // very creative, i know
    var cnd_2 = document.getElementById('cnd_stat_2'); // connected status 2
    if (connected == true) {
        send2.remove();
        send3.remove();
        cnd_2.remove();
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + connected_to + "<br></p>");
        connected_to =  "";
        connected = false;
        //connected_status.insertAdjacentHTML("afterbegin", "connected to: " + connected_to + "<br>");
    }
    console.log(connected_to)
}

function onClickButton_send() {
    var text = textarea.value;
    text && doSend(text);
    textarea.value = "";
    textarea.focus();
}

function writeToScreen(message) {
    output.insertAdjacentHTML("afterbegin", "<p>" + message + "</p>");
}


function name(text) {
    console.log(text);
}