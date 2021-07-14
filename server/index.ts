//@ts-check
const path = require("path")
const fs = require("fs")
const express = require("express")
const ngrok = require("ngrok")
const http = require("http")
const app = express()

const configFile = path.join(".", "config.json")
const baseConfig = `
  {
    "ngrokApiKey": null,
    "standalone": false
  }
`

async function asyncReadConfig() {
  let a
  try {
    a = JSON.parse(fs.readFileSync(configFile, { encoding: "utf-8" }))
  } catch {
    try {
      fs.unlinkSync(configFile)
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error
      }
    }
    fs.writeFileSync(configFile, baseConfig)
    a = JSON.parse(fs.readFileSync(configFile, { encoding: "utf-8" }))
  }
  return a
}
async function asyncReadKConfig(k) {
  let a = {}
  try {
    a = JSON.parse(fs.readFileSync(configFile, {encoding: "utf-8"}))
  } catch {
    try {
      fs.unlinkSync(configFile)
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error
      }
    }
    fs.writeFileSync(configFile, baseConfig)
    a[k] = JSON.parse(baseConfig)[k]
  }
  return a[k]
}
async function asyncWriteConfig(k,v) {
  let a = readConfig()
  a[k] = v
  fs.writeFileSync(configFile, JSON.stringify(a))
  return a[k]
}
function readConfig() {
  let a
  try {
    a = JSON.parse(fs.readFileSync(configFile, { encoding: "utf-8" }))
  } catch {
    try {
      fs.unlinkSync(configFile)
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error
      }
    }
    fs.writeFileSync(configFile, baseConfig)
    a = JSON.parse(fs.readFileSync(configFile, { encoding: "utf-8" }))
  }
  return a
}
function readKConfig(k) {
  let a = {}
  try {
    a = JSON.parse(fs.readFileSync(configFile, { encoding: "utf-8" }))
  } catch {
    try {  
      fs.unlinkSync(configFile)
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error
      }
    }
    fs.writeFileSync(configFile, baseConfig)
    a[k] = JSON.parse(baseConfig)[k]
  }
  return a[k]
}
function writeConfig(k, v) {
  let a = readConfig()
  a[k] = v
  fs.writeFileSync(configFile, JSON.stringify(a))
  return a[k]
}
// tsc server/index.ts
// node server/index.js

// save to file occasionally, then read from file when server starts
// make a cookie on a connection with a uuid, store that in the web client's cookies, and use it as a refrence to find needed information
// js fetch funtion -- use it to ask for information recived from the turtle

// use http protocol instead of websockets for web client 
//    fetch funtion -> get & / or post request? 

// if using ngrok to make a connection w/ websockets and HTPP Protocol, which one is using the one availible link? 

var turtle_ids = [];
//var turtles_connected = turtle_ids.length();
var turtle_names = ["jake","joe","jeff","jon","jonny","james","jonathan"]; // turtle names and titles, randomly choose from one of each 

var sender_turtle = [],
    sender_web = [],
    web_num = 0;

let currentCommand = '{"message":"hi", "id": 0, "api": "CC-Tweaked"}'
app.get("/turtle", (req, res) => {
  res.send(currentCommand)
  currentCommand = '{"message":"hi", "id": 0, "api": "CC-Tweaked"}'
})
// wss.on('connection', function connection(ws) {
//   //console.log(ws);
//   ws.on('message', function incoming(message) { 
//     var data = JSON.parse(message);
//     if (data.type == "web_client") { // if is web client
//       console.log(data);
//       if (data.isEval) {
//         //console.log(ws._sender); // dont do this.
//         var command_obj ={type:"server",isEval:data.isEval,command:data.command};
//         // add turtle names
//         var command_JSON = JSON.stringify(command_obj);
//         if (data.turtle_id != "") {
//           if (data.turtle_id == "all") {
//             console.log(turtle_ids);
//             if (turtle_ids[0] == undefined) {
              
//             } 
//             for (var i = 0; i < turtle_ids.length; i++) {
//               //console.log(i);
//               //console.log(turtle_ids.length);
//               //console.log(sender_turtle[turtle_ids[i]]);
//               if (turtle_ids[i] != "" || turtle_ids[i] != null || turtle_ids[i] != undefined) {
//                 ws._sender = sender_turtle[i];
//                 ws.send(command_JSON);
//               }
//             } 
//           }
//           else if (data.turtle_id == null){
//             console.error('error: data.turtle_id  = null')
//           }
//           else {
//             ws._sender = sender_turtle[data.id]
//             ws.send(command_JSON); 
//             //console.log("sent data to " + data.);
//           }
//         } else {
//           console.log("'sender' is undefined");
//         }
//       } else { // if is_Eval is false
//         if (data.command == "inital_msg" && data.turtle_id == "" || data.turtle_id == null) { // if it is the first message the web client sends
//           sender_web[web_num] = ws._sender;
//           web_num = sender_web.length;
//           //sender_web = deleteDuplicates(sender_web); // may be more info than needed -- can isolate needed info? 
//         }
//       }
//     } else if (data.type == "turtle_client") {
//         console.log(data);
//         //console.log(data.turtle_id); // -- turtle_id is not part of data !! 
//         sender_turtle[sender_turtle.length] = ws._sender;
//         //sender_turtle = deleteDuplicates(sender_turtle); 
//         if (data.name == null || data.n ) {
//           // make a cookie on a connection with a uuid, store that in the web client's cookies, and use it as a refrence to find needed information
//           // js fetch funtion -- use it to ask for information recived from the turtlelength; i++) {
//           if (data.id != turtle_ids[i]) {
//           turtle_ids[turtle_ids.length] = data.id;
//           };
//         };
//         //turtle_ids = deleteDuplicates(turtle_ids);
//         for (var i = 0; i < 15; i++) {
//           if (data.inventory.slots[i] != null){
//             console.log(data.inventory.slots[i]);
//           };
//         };
//         for (var i = 0; i < web_num; i++) {
//           console.log(sender_web[i]);
//           ws._sender = sender_web[i];
//           ws.send(data);
//         };
//     } else {
//       console.log(message)
//     };
//   });
// });

let server = http.createServer(app)
async function main() {
  if (readKConfig("ngrokApiKey") !== null) {
    const url = await ngrok.connect({ addr: 5757, authtoken: readKConfig("ngrokApiKey")});
    var new_url = url.slice(8, url.length);
    console.log(new_url);
    console.log(url);
  } else {
    console.log("Note, not currently logged in to ngrok, doing this will limit the bandwith and the amount of connections to this tunnel")
    const url = await ngrok.connect(5757);
    var new_url = url.slice(8, url.length);
    console.log(new_url);
    console.log(url);
  }
};

server.listen(5757, async () => {
  console.log("Starting Server...")
  await main()
})
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/

// function deleteDuplicates(array_) {
//   let uniqueItems = [...new Set(array_)];
//   uniqueItems = uniqueItems.filter( Boolean ); // https://stackoverflow.com/questions/28607451/removing-undefined-values-from-array
//   return uniqueItems;
// }


