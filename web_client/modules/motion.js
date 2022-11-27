import { socket, send, end, Change } from "./comms.js"
import { cs_selectedTurt, cs_curTurtVisual, setUpTurt, setCs_curTurtVisual } from "./msc.js"
import { fuelCircle, makeRadian } from "./gui.js"
import { rotate, cTarget, removeCube, visualizeCube } from "./3.js"
import { renderedObjects, setRenderedObjects } from "../script.js"

export function moveTurtle(dir = "forward") {
  if (cs_curTurtVisual == null) { 
    console.error("MOVING TURTLE DOES NOT EXIST") 
  } else {
    let move = new Change(1)
    dir != "left" && dir != "right" ? move.move(dir) : move.turn(dir)
    send(socket, move);
  } 
}

// pass to onmessage event
export function turtUpdater(turtObj) {
  // set up fuel, pos, etc.
  fuelCircle(turtObj.fuelLevel, turtObj.fuelLimit);

  let oldObj = Object.assign({}, cs_curTurtVisual.mesh.position);

  cs_curTurtVisual.mesh.position.x = turtObj.x
  cs_curTurtVisual.mesh.position.y = turtObj.y
  cs_curTurtVisual.mesh.position.z = turtObj.z

  //console.log(turtObj.list)
  // updating world: 
  // need to search through entire world,
  // update cubes that need updating, remove if need removing

  // yes this is the meshList from 3.js
  //meshList.forEach( (ele, i) => {
  //  if (ele.)
  //})

  // the above would require looping through the entire world and 
  // seeing where what fits what (what hasn't changed)
  // additionally some info might be hard to update.
  // im just going to reset the entire world. 
  // On a small scale, this isn't a problem

  try { renderedObjects.forEach( (e) =>{
    removeCube(e)
  }); } catch (err) { console.log(err) }

  let rendered = [];
  let toRender = setUpTurt(turtObj, cs_selectedTurt);
  toRender.forEach( (e) => {
    rendered.push(visualizeCube(e));
  });
  setCs_curTurtVisual(rendered[0]);
  setRenderedObjects(rendered);

  rotate(cs_curTurtVisual, makeRadian(turtObj.turn * -90 ));
  cTarget(cs_curTurtVisual, oldObj);
}