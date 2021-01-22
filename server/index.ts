import { Server } from 'ws';
import { connect } from 'ngrok';

const wss = new Server({ port: 5757 });

wss.on('connection', function connection(ws) {
    //console.log(ws);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
});

(async () => {
  const url = await connect(5757);
  console.log(url); 
})();

