import { get_req, start, end, url, changeUrl, send, socket } from "./modules/comms.js"
import { makeUi } from "./modules/gui.js"
import { focusNewTurt, handleTurtChange } from "./modules/msc.js"
import { moveTurtle } from "./modules/motion.js"
import { fpsClose, fpsShow } from "./modules/3.js";

// https://developer.mozilla.org/en-US/docs/Web/API/EventSource
// https://developer.mozilla.org/en-US/docs/Web/API/fetch

export let renderedObjects = [];
export function setRenderedObjects(a) {
  renderedObjects = a;
}

window.setUrl = function() {
  changeUrl("")
  let newUrl = document.getElementById("inLink").value
  let endUrl = newUrl.slice(-1)
  if (newUrl.slice(-12) == "/web_client/") { newUrl.substring(0, newUrl.length-1) } // am i acually changing the url here?
  else if (newUrl.slice(-11) == "/web_client") {changeUrl(newUrl)}
  else if (endUrl == "/") { changeUrl(newUrl+"web_client") }
  else { changeUrl(newUrl+"/web_client") }
  console.log(url);

  
  get_req(url).then(res => {
    // initial request -- get preliminmary info
    for (let i = 0; i < document.getElementsByClassName("toConnect").length; i++) {
      document.getElementsByClassName("toConnect")[i].hidden = true;
    }

    let activeElements = document.getElementsByClassName("active")
    for (let i = 0; i < activeElements.length; i++) {
      activeElements[i].hidden = false;
    }

    addListeners()

    makeUi()

    let timeout 
    function a() {
      if (res.list.length > 0) {
        renderedObjects = focusNewTurt(res.list, 0, []);
    
        // WS 
        let wsUrl = (url.startsWith('wss://') ? url + "/0": "wss://" + url.slice( (url.length * -1) + 8 ) + "/0")
        console.log(wsUrl)
        start(wsUrl);
      } else {
        let wsUrl = (url.startsWith('wss://') ? url : "wss://" + url.slice( (url.length * -1) + 8 ))
        start(wsUrl, (resT)=>{
          //console.log(resT)
          if (resT.list.length > 0) {
            res = resT
            a()
          } else {
            //console.log("b")
            clearTimeout(timeout)
            timeout = setTimeout( ()=>{
              //console.log("a");
              send(socket, {a:"a"});
              // test object
              return undefined;
            }, 60)
          }
        });
        send(socket, {a:"a"})
      }
    }
    a()
    
  }).catch(err => { console.log(err) })
}

//document.getElementById("setlink").addEventListener("click", ()=> { window.setUrl() })


function addListeners() {

  window.getReq = function () {
    get_req(url)
      .then(res => { log(`res: ${JSON.stringify(res)}`); })
      .catch(err => { console.log( err ) });
  }
  document.getElementById("forward").addEventListener("click", ()=> { moveTurtle("forward") })
  document.getElementById("backward").addEventListener("click", ()=> { moveTurtle("backward") })
  document.getElementById("up").addEventListener("click", ()=> { moveTurtle("up") })
  document.getElementById("down").addEventListener("click", ()=> { moveTurtle("down") })
  document.getElementById("left").addEventListener("click", ()=> { moveTurtle("left") })
  document.getElementById("right").addEventListener("click", ()=> { moveTurtle("right") })
  document.getElementById("shiftPos").addEventListener("click", async () => { 
    //console.log(renderedObjects)
    renderedObjects = await handleTurtChange(1, renderedObjects);
    //console.log("a", renderedObjects);
  })
  document.getElementById("shiftNeg").addEventListener("click", async () => {
    //console.log(renderedObjects)
    renderedObjects = await handleTurtChange(-1, renderedObjects);
    //console.log("a", renderedObjects);
  })

  var fpsshown = false;
  document.addEventListener("keydown", dothing);
  async function dothing(e) {
    if (e.code == "ArrowUp" || e.code == "KeyW") { moveTurtle("forward"); }
    else if (e.code == "ArrowDown" || e.code == "KeyS") { moveTurtle("backward"); }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { moveTurtle("left"); }
    else if (e.code == "ArrowRight" || e.code == "KeyD") { moveTurtle("right"); }
    else if (e.code == "ShiftLeft") { moveTurtle("down"); }
    else if (e.code == "Space") { moveTurtle("up"); }
    else if (e.code == "KeyT") { 
      var curTime = new Date()
      //console.log(curTime.toString())
      console.log(`[${curTime.getHours()}:${curTime.getMinutes()}]: ${renderedObjects}`)//${req.method} at ${req.baseUrl}`)
      
    }
    else if (e.code == "Period") { 
      //console.log(handleTurtChange(0,renderedObjects))
      //console.log(renderedObjects)
      renderedObjects = await handleTurtChange(1, renderedObjects);
      //console.log("a", renderedObjects) 
    }
    else if (e.code == "Comma") { 
      //console.log(handleTurtChange(0,renderedObjects))
      //console.log(renderedObjects)
      renderedObjects = await handleTurtChange(-1, renderedObjects); 
      //console.log("a", renderedObjects)
    } else if (e.code == "KeyI") {
      if (!fpsshown) { fpsShow(); fpsshown=true } else { fpsClose(); fpsshown=false }
    }
    else {console.log("Unhandled keypress: " + e.code)};
  }
}