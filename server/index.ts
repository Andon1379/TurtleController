import { Server } from 'ws';
import { connect } from 'ngrok';

const wss = new Server({ port: 5757 });
console.log("Starting Server...");

wss.on('connection', function connection(ws) {
    //console.log(ws);
  ws.on('message', function incoming(message) {
    console.log(message);
    var data = JSON.parse(message);
    console.log(data.type);
    console.log(data.command);
    if (data.isEval) {
      
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

