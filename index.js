// https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
// https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
// https://javascript.info/server-sent-events
// https://expressjs.com/en/starter/hello-world.html
// https://www.npmjs.com/package/node-static
/*
https://wiki.computercraft.cc/Http.websocket
https://wiki.computercraft.cc/HTTP_API
https://github.com/Andon1379/TurtleController/blob/master/server/index.ts
https://www.npmjs.com/package/ws
*/

const express = require('express');
const router = express.Router();
const http = require("http");
const cors = require('cors');
const { Server } = require('ws');
const WebSocket = require('ws');

class turtTest {
  x = 0;
  y = 0;
  z = 0;
  id = null; 
  name = '';
  fuelLevel = undefined
  fuelLimit = undefined
  message = { "message": '', "times": 0, "isRepeat": false, "isDone": false, "doFor": 1, "rMsg":""};
  turn = 0; // 0 = +z, 1 = +x, 2 = -z, 3 = -x, -1 = -x
  list = [] // list for cubes
  
  constructor(SG_ID, fLevel, fLimit, name = '', id = 0) {
    this.fuelLevel = fLevel;
    this.fuelLimit = fLimit;
    this.inv = new inv(16);
    this.SG_id = SG_ID;
    this.id = id;
    this.name = name
  }
  
  moveTurt(dir) {
    if (dir === "up" || dir === "turtle.up()") {
      this.y ++
    } else if (dir === "down" || dir === "turtle.down()") {
      this.y --
    } else if (dir === "forward" || dir === "turtle.forward()") {
      if ( this.turn == 0 || this.turn == -0 ) {this.z ++} 
      else if ( this.turn == 1 || this.turn == -3 ) {this.x ++} 
      else if ( this.turn == 2 || this.turn == -2 ) {this.z --}
      else if ( this.turn == 3 || this.turn == -1 ) {this.x --}
    } else if (dir === "backward" || dir === "turtle.back()") {
      if ( this.turn == 0 || this.turn == -0 ) {this.z --} 
      else if ( this.turn == 1 || this.turn == -3 ) {this.x --} 
      else if ( this.turn == 2 || this.turn == -2 ) {this.z ++}
      else if ( this.turn == 3 || this.turn == -1 ) {this.x ++}
    } else if (dir === "turtle.turnLeft()") {
      this.turnLeft();
    } else if (dir === "turtle.turnRight()") {
      this.turnRight();
    } else { 
      console.error(`ERROR: turtle attempted to move in invalid direction! ${dir}`) 
      return false
    }

    let Cube = this.list.find((element, index, array) => { // searching for blocks
      if (element.x == this.x && element.y == this.y && element.z == this.z) { // if coods are same
        let block = this.removeCube(element.x, element.y, element.z);
        if (!block) { return true } // no block in space
        else {
          console.warn(`WARN: moved turtle into block { ${block.name} } at { x:${block.x} / y:${block.y} / z:${block.z} }, block removed!`)
          return true
        }
      } else { return false } // block does not have conflicitng coords
    }, this)

    //this.fuelLevel = this.fuelLevel - 1; // TOFIX: actually get turtle data here

    return Cube 
  }

  addCube(cube) {
    //console.log(cube)
    if (this.list.length == 0) { this.list.push(cube) } else {
      let added = false;
      this.list.find((element, index, array) => {
        if (element.x === cube.x && element.y === cube.y && element.z === cube.z) {
          // if cube position is the same, update
          this.list[index].data = cube.data
          added = true;
          return true  
        } 
        if (index == array.length - 1 && added == false) {
          this.list.push(cube)
          added = true
          return true
        }
      }, this )
    }
  }

  removeCube(x, y, z) {
    if (this.list.length == 0 ) { return false } // no cubes discovered
    else {
      let removed = false;
      let block = this.list.find((element, index, array)=>{
        if (element.x === x && element.y === y && element.z === z) { // same coords
          this.list.splice(index, 1)
          removed = true;
          return true;
        }
        if (index == array.length - 1 && removed == false) {
          console.warn("WARN: attempted to remove nonexistent cube!")
        }
      }, this)
      return block
    }
  }

  checkTurn() {
    var q = Math.floor(this.turn);
    var r = this.turn % 1;
    if (r == 0 || r == -0) {
      r = q % 4;
      q = Math.floor(Math.abs(q) / 4);
    }
    //console.log(q,r)
    this.turn = r
  }

  turnLeft() {
    this.turn --
    this.checkTurn()
  }

  turnRight() {
    this.turn ++
    this.checkTurn()
  }

  setMessage(message, isRepeat = false, doFor = 1) {
    this.message.message = message;
    this.message.isRepeat = isRepeat;
    this.message.isDone = false;
    this.message.times = 0;
    this.message.doFor = doFor;
    this.message.rMsg = '';
  }
  
}
/*
class cube {
  constructor(x, y, z, data) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.data = data;
  }
}
*/
function cube (x, y, z, data) {
  this.x = x;
  this.y = y;
  this.z = z; 
  this.data = data;
}

class inv {
  constructor() {
    this.selectedSlot = 0;
    this.slots = [
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 },
      { itemId: "", count: 0 }
    ]
  }
  
  resetInv() {
    let tInv = [];
    for (let x=0; x <= this.slots.length - 1; x++) {
      this.tInv[x] = {itemId:'', count:0}
    }
    this.slots = tInv;
    return tInv;
  }

  selectSlot(slotNumb) {
    this.selectedSlot = slotNumb;
  }
}

//const jsonOptions = { defaultCharset: "utf-8", inflate: true, type: "application/json" }
//const textOptions = { defaultCharset: "utf-8", inflate: true, type: "text/plain" }

//app.listen(port, () => {
//  console.log(`Example app listening at http://localhost:${port}`)
//})

run().catch(err => console.log(err));

async function run() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  currentId = 0
  var turtList = []
  // EXAMPLE DATA HERE 
  /*
  turtList.push(new turtTest())
  turtList[turtList.length - 1].addCube(new cube(0,-1,0,"minecraft:grass_block"))
  turtList.push(new turtTest())
  turtList.push(new turtTest())
  turtList[turtList.length - 1].addCube(new cube(0,1,0,"minecraft:stone"))

  totalConnected = turtList.length - 1
  */
  totalConnected = 0;
  router.use(function (req, res, next) {
    var curTime = new Date()
    let curMin = (curTime.getHours()*60)+curTime.getMinutes()
    console.log(`[${(curMin - (curMin % 60) )/ 60}:${curMin%60}]: ${req.method} at ${req.originalUrl}`)
    //console.log("Body:", req.body)
    next()
  })


  //router.get("/", async function(req, res) {
  //  res.send(turtList)
  //})
  
  //router.post("/", (req, res) => {
  //  res.send(req.body);
  //});

  router.use('/', express.static('web_client'))

  
  router.get('/web_client', (req, res) => {
    res.send( { "list" : turtList , "selected": currentId, "total":totalConnected } )
  })

  router.get("/web_client/:id", (req, res) => {
    console.log("Params:", req.params)
    let id = req.params.id 
    res.send(turtList[id])
  })

  router.post('/web_client/:id', (req, res) => {
    console.log("Params:", req.params)
    let id = req.params.id 
    if (req.body.dir) {
      move(req.body.dir, id)
    }
    res.send(turtList[id])
  })
  


  // TURTLE PATHS
  router.get('/turtle/:id', (req, res) => {
    console.log("message recieved from turtle #", req.params.id, "(computer id:", req.params.id, ")");
    if (req.params.id != undefined || req.params.id != 'None') {
      res.send(turtList[req.params.id]);
    }
  });
  
  router.post('/turtle', (req, res) => {
    // had trouble getting data from req.body -- so i'm using a header
    if (req.headers.data) {
      //console.log(req.headers.data)
      data = JSON.parse(req.headers["data"])
      console.log(data)
      let responseOBJ = {};
      responseOBJ.message = "";
      responseOBJ.SG_id = data.SG_id;

      if (data.SG_id == null) { // new turt
  
        let newTurtleOBJ = new turtTest(
          turtList.length, // server - given id
          data.fuel.fuelLevel,
          data.fuel.fuelLimit,
          data.name,
          data.id // computer id 
        );

        let id = turtList.length;
        responseOBJ.SG_id = id;
        turtList[id] = newTurtleOBJ;

        data.blocks.up.sucess ? addCube( turtList[id], data.blocks.up, 0,1,0 ) : undefined ; 
        data.blocks.down.sucess ? addCube( turtList[id], data.blocks.down, 0,-1,0 ) : undefined ;
        
        let xMod = 0;
        let zMod = 0;
        function generateMod(turn) {
          if ( turn == 0 || turn == -0 ) {zMod ++} 
          else if ( turn == 1 || turn == -3 ) {xMod ++} 
          else if ( turn == 2 || turn == -2 ) {zMod --}
          else if ( turn == 3 || turn == -1 ) {xMod --}
        }
        
        generateMod(turtList[id].turn)
        data.blocks.front.sucess ? addCube( turtList[id], data.blocks.front, xMod, 0, zMod ) : undefined;
  
        responseOBJ.message = "new turtle added"
        console.log(responseOBJ);
        //console.log(JSON.stringify(responseOBJ))
        console.log(turtList[responseOBJ.SG_id])
  
        res.send(JSON.stringify(responseOBJ));  // server - given ID? 
        totalConnected += 1;
      } else {
        if (turtList[data.SG_id]) {
          // if there is a matching turtle already in the server's memory
          let turtObj = new makeTurt(
            data.SG_id,
            //data.inventory, 
            data.fuel.fuelLevel,
            data.fuel.fuelLimit,
            data.name, 
            data.id,
          );
          turtObj.inv = data.inventory;

          (typeof data.x === "number") ? turtObj.x = data.x : turtObj.x = turtObj.x;
          (typeof data.y === "number") ? turtObj.y = data.y : turtObj.y = turtObj.y;
          (typeof data.z === "number") ? turtObj.z = data.z : turtObj.z = turtObj.z;

          data.blocks.up.sucess ? addCube( turtList[id], data.blocks.up, 0,1,0 ) : undefined ; 
          data.blocks.down.sucess ? addCube( turtList[id], data.blocks.down, 0,-1,0 ) : undefined ;
          
          let xMod = 0;
          let zMod = 0;
          function generateMod(turn) {
            if ( turn == 0 || turn == -0 ) {zMod ++} 
            else if ( turn == 1 || turn == -3 ) {xMod ++} 
            else if ( turn == 2 || turn == -2 ) {zMod --}
            else if ( turn == 3 || turn == -1 ) {xMod --}
          }
          
          generateMod(turtList[id].turn)
          data.blocks.front.sucess ? addCube( turtList[id], data.blocks.front, xMod, 0, zMod ) : undefined;
            
          turtObj.message = data.message;
          
          turtList[data.SG_id] = turtObj;

          if (data.message.isDone === true) {
            turtList[data.SG_id].message.isDone = true
          }
          responseOBJ.message = "updated serverside turtle";
          //console.log(turtList[req.body.SG_id])
          console.log(responseOBJ);
          res.send(JSON.stringify(responseOBJ));
        
        } else {
          console.error("ERROR: GIVEN SERVER ID DOES NOT MATCH --\n    compared turtle's SG_id (", data._SG_id, ") to server's SG_id (0 -", turtList.length, ")");
        }
      }
    } // go here if req.body exists (but it may not so don't do that)
  });

  router.post('/turtle/:id', (req, res)=>{
    if (turtList[req.params.id]) {
      if (req.headers.data) {
        //console.log(req.headers.data);
        let data = JSON.parse(req.headers.data);
        console.log(data)
        let id = req.params.id

        turtList[id].fuel = data.fuel;
        turtList[id].name = data.name;
        turtList[id].id = data.id;

        turtList[id].message.isDone = data.message.isDone;
        turtList[id].message.times = data.message.times;
        
        if(turtList[id].message.isDone === true) {
          turtList[id].moveTurt(turtList[id].message.message);

          if (turtList[id].message.isRepeat == false) {
            turtList[id].message.message = "";
            turtList[id].message.isDone = false;
            turtList[id].message.times = 0;
          }
        }
        console.log(turtList[id])

        data.blocks.up.sucess ? addCube( turtList[id], data.blocks.up, 0,1,0 ) : undefined ; 
        data.blocks.down.sucess ? addCube( turtList[id], data.blocks.down, 0,-1,0 ) : undefined ;
        
        let xMod = 0;
        let zMod = 0;
        function generateMod(turn) {
          if ( turn == 0 || turn == -0 ) {zMod ++} 
          else if ( turn == 1 || turn == -3 ) {xMod ++} 
          else if ( turn == 2 || turn == -2 ) {zMod --}
          else if ( turn == 3 || turn == -1 ) {xMod --}
        }
        
        generateMod(turtList[id].turn)
        data.blocks.front.sucess ? addCube( turtList[id], data.blocks.front, xMod, 0, zMod ) : undefined;
        
        turtList[id].inv = data.inventory;
        
        console.log(turtList[id]);
        res.send(JSON.stringify(turtList[id]));
      } 
    } else { // no req.body
      console.error(`ERROR on POST request to '/turtle/${req.params.id}': Turtle does not exist`);
    }
  });

  
  app.use('/', router); 
  let server = await app.listen(3000);
  console.log('Listening on port 3000');

  // WEB SOCKET STUFF
  
  // function to emit when ponged
  function heartbeat() {
    this.isAlive = true;
  }
  
  const WCwss = new Server( { noServer: true } );
  WCwss.on('connection', function connection(ws, req) {
    console.log(`Socket recived new WC connection!`)
    ws.isAlive = true;
    // set handler for pong event, emit heartbeat
    ws.on('pong', heartbeat);
    (typeof req.url.split('/')[2] != "undefined" && req.url.split('/')[2] !== '' ) ? ws.connectedID = req.url.split('/')[2] : ws.connectedID = null;
    
  
    ws.on('message', function message(data) {
      //console.log('received data from: %s', req.url);
      //console.log(ws.connectedID)
      //console.log(typeof req.url.split('/')[2], req.url.split('/')[2]);

      if (typeof req.url.split('/')[2] !== 'undefined' && req.url.split('/')[2] !== '') {
        let id = req.url.split('/')[2]

        data = JSON.parse(data);
        console.log(data)
        if (data._type != "" && data.message.message) { 
          

          turtList[id].message = data.message
          //console.log(data.message)

          Twss.clients.forEach(function each(client) {
            if(client.readyState == WebSocket.OPEN && client.connectedID == id) {
              console.log(JSON.stringify(data.message));
              client.send(JSON.stringify(data.message));
            }
          });

        }
        // need to handle different turts 

        
        // send data at the end of updating turtle object to every client

        //let toSend = JSON.stringify(turtList[id]); 
        //WCwss.clients.forEach(function each(Wws) {
        //  if(Wws.readyState === WebSocket.OPEN && Wws.connectedID === id) {
        //    //console.log(ws)
        //    Wws.send(toSend);
        //  }
        //});
        // this is handled by sending the data to the turtle

        
      } else {
        //console.log(data)
        ws.send(JSON.stringify( { msg:"Don't use this! Ping a turtle Id instead after the web client identifier!", list:turtList } ));
        // maybe remove connection here 
        // didnt like sending this 
      }
    });

    ws.on('close', (code, number) => {
      console.log(`WC Websocket connection closed with code ${code}: ${number}`);
    });

    /*
    if (typeof req.url.split('/')[2] != undefined && req.url.split('/')[2] !== '' ) {
      while (true) { // CAUSES SERVER CRASH! OOPS!
        setTimeout( () => {
          ws.send(JSON.stringify( turtList[req.url.split('/')[2]] )) 
        }, 50);
      } 
    }
    */
  });
  
  // make interval for pinging each client
  const interval = setInterval(function ping() {
    WCwss.clients.forEach(function each(ws) {
      // if a client's connection is not alive, terminate it 
      if (ws.isAlive === false) return ws.terminate();
      
      ws.isAlive = false;
      ws.ping();
    });

    Twss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
  
  WCwss.on('close', function close() {
    clearInterval(interval);
  });

  // turtle server handling
  const Twss = new Server( {noServer: true } );
  /*
  const tInterv = setInterval(()=>{
    Twss.clients.forEach(function each(ws) {
      ws.send() // send what // TODO
    });
  }, 300); */

  Twss.on('connection', (ws, req)=>{
    ws.isAlive = true;
    ws.on("pong", heartbeat); 

    (typeof req.url.split('/')[2] != undefined && req.url.split('/')[2] !== '' ) ? 
      ws.connectedID = req.url.split('/')[2] : 
      ws.connectedID = null;
    
    ws.on('message', (data) => {
      console.log(`Message from turtle received!`);
      //console.log(JSON.parse(data), ws.connectedID);
      // this logic mostly the same as POST turtle/:id
      // make a function to avoid this
      data = JSON.parse(data);
      console.log(data.message);
      //console.log(turtList[ws.connectedID])
      let id = ws.connectedID

      turtList[id].fuel = data.fuel;
      turtList[id].fuelLevel = data.fuel.fuelLevel;
      turtList[id].fuelLimit = data.fuel.fuelLimit;


      turtList[id].name = data.name;
      turtList[id].id = data.id;

      turtList[id].message.isDone = data.message.isDone;
      turtList[id].message.times = data.message.times;
      
      if(turtList[id].message.isDone === true && data.message.message !== "") {
        //console.log(data.message);
        // handle messages and commands that have been run

        switch(data.message.message) {
          case 'turtle.up()':
          case 'turtle.down()':
          case 'turtle.forward()':
          case 'turtle.back()':
          case 'turtle.turnLeft()':
          case 'turtle.turnRight()':
            turtList[id].moveTurt(data.message.message);  
        }

        if (turtList[id].message.isRepeat == false) {
          turtList[id].message.message = "";
          turtList[id].message.isDone = false;
          turtList[id].message.times = 0;
          turtList[id].message.rMsg = "";
        }
      }
      
      addCube( turtList[id], data.blocks.up, 0,1,0 );
      addCube( turtList[id], data.blocks.down, 0,-1,0 );
      
      let xMod = 0;
      let zMod = 0;
      function generateMod(turn) {
        if ( turn == 0 || turn == -0 ) {zMod ++} 
        else if ( turn == 1 || turn == -3 ) {xMod ++} 
        else if ( turn == 2 || turn == -2 ) {zMod --}
        else if ( turn == 3 || turn == -1 ) {xMod --}
      }
      
      generateMod(turtList[id].turn)
      addCube( turtList[id], data.blocks.front, xMod, 0,zMod );
      
      turtList[id].inv = data.inventory;
      
      //console.log(turtList[id]);
      ws.send(JSON.stringify(turtList[id].message));

      // update web clients
      let toSend = JSON.stringify(turtList[id]); 
      WCwss.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN && client.connectedID === id) {
          console.log(toSend)
          //console.log(client.connectedID);
          client.send(toSend);
        }
      });

    });
    
    ws.on('close', (code, num) => {
      console.log(`Turtle Websocket connection ${ws.connectedID} closed with code ${code}: ${num}`);
      turtList.splice(turtList.findIndex((element)=>{turtList[ws.connectedID] == element}), 1 ,undefined) // untested!
    });

    ws.send(JSON.stringify(turtList[ws.connectedID].message));
  });
  
  // upgrade to change protocols
  server.on('upgrade', function upgrade(req, socket, head){
    // handle change of protocol
    console.log(req.originalUrl, req.protocol, req.url, req.path, req.body)
    if (req.url.split('/')[1] === "web_client") {
      //console.log()
      WCwss.handleUpgrade(req, socket, head, function done(ws, req) {
        WCwss.emit('connection', ws, req);
      });
    } else if (req.url.split('/')[1] === "turtle") {
      Twss.handleUpgrade(req, socket, head, function done(ws, req) {
        Twss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
    
  });

  // functions
  function move(dir, id) {  
    // make this based on the message of the turtle
    if (dir == "forward") { turtList[id].moveTurt("forward") }
    else if (dir == "backward") { turtList[id].moveTurt("backward") }
    else if (dir == "up") { turtList[id].moveTurt("up") }
    else if (dir == "down") { turtList[id].moveTurt("down") }
    else if (dir == "right") { turtList[id].turnRight() }
    else if (dir == "left") { turtList[id].turnLeft() }
    else { console.log(`invalid dir at turtle ${id}: ${dir}`) }
  }

}

function addCube(tObj, block, xMod= 0, yMod=0, zMod=0) {
  //console.log(block)
  //console.log(tObj)
  //console.log(cube)
  if (block.sucess) {
    tObj.addCube( new cube(
      tObj.x + xMod, 
      tObj.y + yMod, 
      tObj.z + zMod,
      block.data
    ));
  }
}

/*
*   get rid of extraneous messages
*   todo: we should mke it so that the client labler works off of the name, and not the id
*   try reconnecting on a disconnect for turtle
*   move camera with turtle
*   add error handling (eg: if turtle does not have fuel)
*
*/