import { turtUpdater } from "./motion.js";

export class Change { 
  _type = '';
  constructor(times = 1) {
    this._type = "";
    // need message object
    this.message = {}
    this.message.isDone = false;
    let repeat = false;
    if (times >= 2) {repeat = true;} 
    this.message.isRepeat = repeat;
    this.message.times = times; // add this serverside
  }
  
  move(dir) {
    this._type = "move";
    if (dir === "forward" ||
        dir === "turtle.forward" ||
        dir === "turtle.forward()" || 
        dir === "forwards") {
      
      this.message.message = "turtle.forward()";
      return this;
      
    } else if (dir === "backward" ||
        dir === "backwards" ||
        dir === "turtle.back()" ||
        dir === "back" ) {

      this.message.message = "turtle.back()";
      return this;
    } else if (dir === "up" ||
               dir === "turtle.up" ||
               dir === "turtle.up()") {
      this.message.message = "turtle.up()";
      return this;
      
    } else if (dir === "down" ||
               dir === "turtle.down" ||
               dir === "turtle.down()") {
      this.message.message = "turtle.down()";
      return this;
    } else {
      console.log(`invalid direction! direction: ${dir}`)
    } 
  } 
  
  turn(dir) {
    if (dir === "right" ||
        dir === "turtle.right" ||
        dir === "turtle.right()" ||
        dir === "turtle.turnRight()") {
      this.message.message = "turtle.turnRight()";
      this._type = 'turnChange';
    } else if (dir === "left" ||
               dir === "turtle.left" ||
               dir === "turtle.left()" ||
               dir === "turtle.turnLeft()") {
      this.message.message = "turtle.turnLeft()";
      this._type = 'turnChange';
      return this;
    } else {
      console.log(`invalid direction! direction: ${turn}`)
    } 
  }
  selectedSlot(slotID) {
    this.selectedSlot = slotID;
    this._type = 'slotChange';
    return this
  }
  selectedTurt(turtID) {
    this.newID = turtID;
    this._type = 'selectedTurt'; // probably will never need this
    return this 
  }
  runCmd(message) {
    this.message.message = message;
    this._type = 'runCmd';
    return this
  }
  checkUpdated(){
    this._type = 'checkUpdated'
    return this
  }

  // this is good, but breaks internet explorer
  // oh well~
  // it's depreciated anyways 
}

export let url = ""

export function changeUrl(newUrl = "") {
  url = newUrl
  return url
}

export async function post_req(url, data = {}) {
  //console.log(data, JSON.stringify(data))
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    alert(`HTTP error! Status: ${response.status}`)
  }
  return response.json();
}

export async function get_req(url) {
  const response = await fetch(url, {
    method:'get',
    mode:'cors',
    cache:'no-cache',
    credentials:'same-origin',
    headers:{ 'Content-Type': 'application/json' },
    redirect:'follow',
    referrerPolicy:'no-referrer'
  });
  return response.json();
}

function heartbeat() {
  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000); // ping every 30 secs + a second of latency
}

export let socket;
export function start(url, func = turtUpdater, ...args) {
  if(socket == undefined || socket.readyState === 3) {
    socket = new WebSocket(url);
  } else {
    socket.close()
    socket = new WebSocket(url);
  }
  socket.addEventListener('open', (event) => {
    console.log('Connected!');
  });
  
  socket.addEventListener('close', (event) => {
    console.log('Connection Terminated!');
    console.log(event)
  });
  
  socket.addEventListener('message', (event) => {
    //console.log('Message from server ', event.data);
    //console.log(JSON.parse(event.data));
    let turt = JSON.parse(event.data);
    // update inv, world 
    return func(turt, ...args);
  });
  
} 
export function end(socket = socket) { socket.close(); } 

function sleep(ms = 1000) {
  return new Promise(resolve => { setTimeout(resolve, ms); } );
  // have to use await in this function
}

export async function send(socket, data) {
  if (socket.readyState !== 1) {
    //setTimeout(()=>{send(socket, data);}, 750);
    await sleep(50);
    send(socket, data);
  }
  if (typeof data === "string") {
    socket.send(data);
  } else if ( typeof data === "object") {
    socket.send(JSON.stringify(data));
  }
}
