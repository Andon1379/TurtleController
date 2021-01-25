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

function doSend(client_name, is_eval, message) {
    var client_type = "web_client"
    var message_obj = {type:client_type, name:client_name, isEval:is_eval,command:message};
    var JSON_message = JSON.stringify(message_obj);
    // sending things
    console.log('sent: %s', message);
    writeToScreen_send("SENT: " + message);
    socket.send(JSON_message);
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
    //var text = textarea.value;
    //var name = document.getElementById("username").value
    if (text != "") {
        text && doSend("web", false, text);
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

function send_exec(text) {
    if (text != "") {
        text && doSend("web", true, text);
        sent_count++;
    }
    console.log(sent_count);
}

function name(text) {
    console.log(text);
}