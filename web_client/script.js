var output = document.querySelector("#output"),
    connected = false,
    connected_to = document.querySelector("div.websocket textarea").value;
var send = document.getElementById('send_id');
var sent_count = 0; 

connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + connected_to + "<br></p>");

function onClickButton_connect() {
    var cnd_2 = document.getElementById('cnd_stat_2');
    if (connected == false) {
        send.insertAdjacentHTML("afterbegin", "<textarea cols=60 rows=6 id='send_id2'></textarea><button onclick='onClickButton_send();' id='send_id3'>send</button>");
        connected = true;
        cnd_2.remove();
        connected_to = document.querySelector("div.websocket textarea").value;
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + connected_to + "<br></p>");
    } else {
        onClickButton_disconnect();
    }
    console.log(connected_to);
}

function doSend(message) {
    //ws.send(message);
    console.log('sent: %s', message);
    writeToScreen_send("SENT: " + message);
}

function onClickButton_disconnect() {
    var output = document.getElementById('out_id');
    var send3 = document.getElementById('send_id3'); 
    var send2 = document.getElementById('send_id2'); // very creative, i know
    var cnd_2 = document.getElementById('cnd_stat_2'); // connected status 2
    if (connected == true) {
        send2.remove();
        send3.remove();
        cnd_2.remove();
        sent_count = 0;
        output.remove();
        send.insertAdjacentHTML("afterend", "<div class=output id=out_id></div>")
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + connected_to + "<br></p>");
        connected_to =  "";
        connected = false;
        //connected_status.insertAdjacentHTML("afterbegin", "connected to: " + connected_to + "<br>");
    }
    console.log(connected_to)
}

function onClickButton_send() {
    textarea = document.getElementById("send_id2");
    var text = textarea.value;
    if (text != "") {
        text && doSend(text);
        sent_count++;
    }
    console.log(sent_count);
    textarea.value = "";
    textarea.focus();
}

function writeToScreen_send(message) {
    var output = document.getElementById('out_id');
    output.insertAdjacentHTML("afterbegin", "<p id=sent>" + message + "</p>");
}


function name(text) {
    console.log(text);
}