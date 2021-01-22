var output = document.querySelector("#output"),
    connected = false;
var send = document.getElementById('send_id');
var sent_count = 0; 

var ws_url = document.getElementById('ws_url');
let socket = new WebSocket(ws_url.value);

connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + socket + "<br></p>");

function onClickButton_connect() {
    var cnd_2 = document.getElementById('cnd_stat_2');
    if (connected == false) {
        // socket connections
        ws_url = document.getElementById('ws_url');
        socket = new WebSocket(ws_url.value);
        
        send.insertAdjacentHTML("afterbegin", "<textarea cols=60 rows=6 id='send_id2'></textarea><button onclick='onClickButton_send();' id='send_id3'>send</button>");
        connected = true;
        cnd_2.remove();
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + ws_url.value + "<br></p>");
    } else {
        onClickButton_disconnect();
    }
    console.log(socket.url);
}

function doSend(message) {
    //ws.send(message);
    console.log('sent: %s', message);
    writeToScreen_send("SENT: " + message);
    // need to parse things in json to the server
    socket.send("web_client: " + message);
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
        send.insertAdjacentHTML("afterend", "<div class=output id=out_id></div>");
        // disconnect from websocket
        socket.close();
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + "" + "<br></p>");
        connected = false;
        //connected_status.insertAdjacentHTML("afterbegin", "connected to: " + "" + "<br>");
    }
    //console.log(socket)
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