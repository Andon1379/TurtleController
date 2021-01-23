import { Server } from 'ws';
import { connect } from 'ngrok';

var turtle_ids = [];
//var turtles_connected = turtle_ids.length();
var turtle_names = ["jake","joe","bill","sally"];

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
      if (data.isEval) {
       ws.send(message); 
      }
    } else if (data.type == "turtle_client") {
      console.log(data.id);
      if (data.name == null) {
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

