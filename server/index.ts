import { Server } from 'ws';
import { connect } from 'ngrok';

// tsc server/index.ts
// node server/index.js

var turtle_ids = [];
//var turtles_connected = turtle_ids.length();
var turtle_names = ["jake","joe","jeff","jon","jonny","james","jonathan"];

var sender_turtle = [],
    sender_web = [],
    web_num = 0;

const wss = new Server({ port: 5757 });
console.log("Starting Server...");

wss.on('connection', function connection(ws) {
  //console.log(ws);
  ws.on('message', function incoming(message) { 
    var data = JSON.parse(message);
    if (data.type == "web_client") { // if is web client
      console.log(data);
      if (data.isEval) {
        //console.log(ws._sender); // dont do this.
        var command_obj ={type:"server",isEval:data.isEval,command:data.command};
        // add turtle names
        var command_JSON = JSON.stringify(command_obj);
        if (data.turtle_id != "") {
          if (data.turtle_id == "all") {
            console.log(turtle_ids);
            if (turtle_ids[0] == undefined) {
              
            } 
            for (var i = 0; i < turtle_ids.length; i++) {
              //console.log(i);
              //console.log(turtle_ids.length);
              //console.log(sender_turtle[turtle_ids[i]]);
              if (turtle_ids[i] != "" || turtle_ids[i] != null || turtle_ids[i] != undefined) {
                ws._sender = sender_turtle[i];
                ws.send(command_JSON);
              }
            } 
          }
          else if (data.turtle_id == null){
            console.error('error: data.turtle_id  = null')
          }
          else {
            ws._sender = sender_turtle[data.id]
            ws.send(command_JSON); 
            //console.log("sent data to " + data.);
          }
        } else {
          console.log("'sender' is undefined");
        }
      } else { // if is_Eval is false
        if (data.command == "inital_msg" && data.turtle_id == "" || data.turtle_id == null) { // if it is the first message the web client sends
          sender_web[web_num] = ws._sender;
          web_num = sender_web.length;
          sender_web = deleteDuplicates(sender_web); // may be more info than needed -- can isolate needed info? 
        }
      }
    } else if (data.type == "turtle_client") {
      console.log(data);
      //console.log(data.turtle_id); // -- turtle_id is not part of data !! 
      sender_turtle[sender_turtle.length] = ws._sender;
      //sender_turtle = deleteDuplicates(sender_turtle); 
      turtle_ids[turtle_ids.length] = data.id;
      //turtle_ids = deleteDuplicates(turtle_ids);
      for (var i = 0; i < 15; i++) {
        if (data.inventory.slots[i] != null){
          console.log(data.inventory.slots[i]);
        }
      }
      if (data.name == null || data.name == "") { // OR is ||, AND is &&
        // if a turtle does not have a name, assume it's a new turtle
        var new_name = turtle_names[data.id]; 
        var new_data = {type:"new_data",name:new_name,id:data.id}
        console.log(JSON.stringify(new_data));
        ws.send(JSON.stringify(new_data));
      }
    } else {
      console.log(message)
    }
  });
});

(async () => {
  const url = await connect(5757);
  var new_url = url.slice(8,url.length);
  console.log(new_url);
  new_url = url.replace("https://", "wss://");
  console.log(new_url);
})();

//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/

function deleteDuplicates(array_) {
  let uniqueItems = [...new Set(array_)];
  uniqueItems = uniqueItems.filter( Boolean ); // https://stackoverflow.com/questions/28607451/removing-undefined-values-from-array
  return uniqueItems;
}