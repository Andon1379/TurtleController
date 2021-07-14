var output = document.querySelector("#output"),
    connected = false,
    send = document.getElementById('send_id'),
    sent_count = 0; 

function onClickButton_connect() {
    window.socket = new WebSocket(document.getElementById("ws_url").value);
    
    window.socket.onmessage = function(event) {
        console.log(event);
    };

    connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + socket + "<br></p>");

    var cnd_2 = document.getElementById('cnd_stat_2');
    if (connected == false) {
        // socket connections
        var socket = new WebSocket(document.getElementById('ws_url').value);
        
        send.insertAdjacentHTML("afterbegin", "<textarea cols=60 rows=6 id='send_id2'></textarea><button onclick='onClickButton_send();' id='send_id3'>send</button>");
        connected = true;
        cnd_2.remove();
        connected_status.insertAdjacentHTML("afterbegin", "<p id=cnd_stat_2>connected to: " + ws_url.value + "<br></p>");
        // inital message
        //doSend("web",false,'inital_msg','all');
        init_msg();
    } else {
        onClickButton_disconnect();
        onClickButton_connect();
    }
    console.log(socket.url);
}
function doSend(client_name, is_eval, message, id) {
    var client_type = "web_client"
    var message_obj = {type:client_type, name:client_name, isEval:is_eval,command:message,turtle_id:id};
    var JSON_message = JSON.stringify(message_obj);
    // sending things
    if (socket != null) {
        console.log(message_obj);
        writeToScreen_send("SENT: " + message);
        socket.send(JSON_message);
    } else {
        console.error("socket object is undefined.");
    };
}

function onClickButton_disconnect() {
    var output = document.getElementById('out_id');
    var send3 = document.getElementById('send_id3'); 
    var send2 = document.getElementById('send_id2'); // very creative, i know
    var cnd_2 = document.getElementById('cnd_stat_2'); // connected status 2
    if (connected == true) {
        //send2.remove();
        if (send3 != null ) { 
            send3.remove()
        };
        if (cnd_2 != null) {
            cnd_2.remove();
        };
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
    turtle_id = document.getElementById("turtle_id");
    var text = textarea.value;
    //var name = document.getElementById("username").value
    if (text != "") {
        text && doSend("web", false, text, turtle_id);
        sent_count++;
    }
    //console.log(sent_count);
    textarea.value = "";
    textarea.focus();
};

function writeToScreen_send(message) {
    var output = document.getElementById('out_id');
    output.insertAdjacentHTML("afterbegin", "<p id=sent>" + message + "</p>");
};

function send_exec(text) {
    if (text != "") {
        text && doSend("web", true, text, "all");
        sent_count++;
    };
    console.log(sent_count);
};

function name(text) {
    console.log(text);
};
// let msgTimeout = 0
// async function init_msg() {
//     if (msgTimeout >= 30) {
//         socket.close()
//     }
//     if (socket.readyState != 1) {
//         setTimeout(() => {
//             msgTimeout++
//             init_msg()
//         }, 1000); 
//     } else {
//         var message_obj = {type:"web_client", name:"web", isEval:false,command:"inital_msg",turtle_id:'all'};
//         console.log(message_obj);
//         console.log("Connected")
//         if (socket) {
//             socket.send(JSON.stringify(message_obj));
//         } else {
//             setTimeout(init_msg, 300); // no clue how long this should be
//         }
//     }
// };
// socket.onopen = function() { 
// };
