import { updateSelected, makeRadian } from "./gui.js"
import { visualizeCube, removeCube, rotate, cTarget } from "./3.js"
import { get_req, url, start, end, socket} from "./comms.js" 

export let cs_selectedTurt;
export let cs_curTurtVisual;
export function setCs_curTurtVisual(a) {cs_curTurtVisual = a}

export var focusNewTurt = function(turtList, newTId, oldCubes = []) {
  //console.log(turtList)
  cs_selectedTurt = newTId

  updateSelected(cs_selectedTurt, turtList);

  
  let oldObj
  if (!cs_curTurtVisual) {
    oldObj = Object.assign({}, {x:0, y:0, z:0});
  } else { oldObj = Object.assign({}, cs_curTurtVisual.mesh.position);}

  
  try {
    //console.log("OLD CUBES:", oldCubes)
    oldCubes.forEach((ele)=>{
      //console.log(ele)
      removeCube(ele)
    })
    
  } catch (e) {
    console.log(e)
  }
  
  //console.log(turtList[newTId], newTId)
  let toVisualize = setUpTurt(turtList[newTId], newTId);
  //oldCubes[0] ? cTarget(toVisualize[0], oldCubes[0].mesh.position) : 
                //cTarget(toVisualize[0], oldCubes[0])

  let visualized = []
  for (var i = 0; i <= toVisualize.length - 1; i++) {
    //console.log(toVisualize[i])
    visualized.push(visualizeCube(toVisualize[i]))
  }

  cTarget(visualized[0], oldObj)
  
  
  
  cs_curTurtVisual = visualized[0]
  rotate(cs_curTurtVisual, makeRadian(toVisualize[0].turn * 90 ))

  //console.log(visualized)
  return visualized
  //console.log(visualized)
}



//https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
export var stringToColor = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  //console.log(colour);
  return colour;
}

export function setUpTurt(turtObj, curId) {
  //console.log(turtObj)
  // set up list to pass to a visualize cube func
  let cubeList = []
  
  // first element will always be turtle, others are cubes
  cubeList[0] = {x : turtObj.x,
                 y : turtObj.y,
                 z : turtObj.z,
                 turn : turtObj.turn,
                 _type : "turtle",
                 name : `turtle_${curId}`
                }

  // generate cubes from in a FILO order
  // (first discovered, last generated)
  if (turtObj.list.length >= 1) {
    for (let i = turtObj.list.length-1; i >= 0; i--) {
      cubeList[i+1] = {}
      for (const prop in turtObj.list[i]) {
        // shift all indecies up 1 to avoid overwriting turtle
        cubeList[i+1][prop] = turtObj.list[i][prop]
        // copy all data from turtle cubes to new cubes
        // expecting x, y, z, name
      }

      cubeList[i+1].color = stringToColor(turtObj.list[i].data.name)
      cubeList[i+1].data = turtObj.list[i].data.name
      cubeList[i+1]._type = "cube"
      cubeList[i+1].name = `cube_${curId}-${i}`
      // naming scheme: turtleID - cubeID
    }
  }
  // again, pass this into a visualize cube function
  return cubeList
}

export async function handleTurtChange(shift, oldRender) { 
  let oldSelectID = cs_selectedTurt
  let list;
  //console.log("a", cs_selectedTurt)
  
  let res = await get_req(url)
  //console.log(res.total, "total", cs_selectedTurt, shift)
  //console.log(list, res.list)
  list = res.list;
  
  //console.log(cs_curTurtVisual)
  if ( (cs_selectedTurt + shift) >= res.total ) { 
    // new selected turtle's id is more than the total numbers
    cs_selectedTurt = 0 

  } else if ( (cs_selectedTurt + shift) < 0 ) {
    // new selected turtle's id is less than 0
    cs_selectedTurt = res.total - 1 

  } else { cs_selectedTurt = cs_selectedTurt + shift; }

  end(socket);
  let wsUrl = (url.startsWith('wss://') || url.startsWith('ws://')) ? `${ url }/${ cs_selectedTurt }` : `${url.replace(/[A-z0-9]+\:\/\//, location.protocol == "https:" ? "wss://" : "ws://")}/${cs_selectedTurt}` //"wss://" + url.slice( (url.length * -1) + 8 ) + `/${cs_selectedTurt}`)
    console.log(wsUrl)
    start(wsUrl);

  //console.log(oldRender, list)
  let visualized = focusNewTurt(list, cs_selectedTurt, oldRender);

  //console.log(visualized)
  return visualized
}
