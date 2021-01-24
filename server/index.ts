import { Server } from 'ws';
import { connect } from 'ngrok';

// tsc server/index.ts
// node server/index.js

var turtle_ids = [];
//var turtles_connected = turtle_ids.length();
var turtle_names = ["jake","joe","jeff","jon","johnny"];

const wss = new Server({ port: 5757 });
console.log("Starting Server...");

wss.on('connection', function connection(ws) {
  //console.log(ws);
  ws.on('message', function incoming(message) {
    console.log(message);
    var data = JSON.parse(message);
    console.log(data.type);
    if (data.type == "web_client") {
      console.log(data.command);
      console.log(data.isEval);
      if (data.isEval) {
        // console.log(ws); // never do this -- it is illegible
        var command_obj ={type:"server",isEval:data.isEval,command:data.command};
        // add turtle names
        var command_JSON = JSON.stringify(command_obj);
        ws.send(command_JSON); 
      }
    } else if (data.type == "turtle_client") {
      console.log(data.id);
      if (data.name == null || data.name == "") {
        // if a turtle does not have a name, assume it's a new turtle
        turtle_ids[turtle_ids.length] = data.id;
        var new_name = turtle_names[turtle_ids.length - 1]; 
        var new_data = {type:"new_data",name:new_name}
        ws.send(JSON.stringify(new_data));
        console.log(JSON.stringify(new_data));
      }
    }
  });
});

(async () => {
  const url = await connect(5757);
  console.log(url);
  var new_url = url.slice(8,url.length);
  console.log(new_url);
  new_url = url.replace("https://", "wss://");
  console.log(new_url);
})();

