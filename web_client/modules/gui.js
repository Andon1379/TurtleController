import {camera, scene, renderer} from "./3.js"
import {cs_selectedTurt, cs_curTurtVisual} from "./msc.js"

// update UI for switching to a new turtle
export function updateSelected(selectId, tList){
  //console.log(tList)
  let selected = document.getElementById("selected")
  selected.textContent = `${selectId + 1} / ${tList.length}`
  fuelCircle(tList[selectId].fuelLevel, tList[selectId].fuelLimit)
  fillInv(tList[selectId].inv);
}

// fuel
export function makeRadian(degrees) {return (Math.PI/180)*degrees} 
// radians = (pi / 180) * degrees
export function makeDegrees(radians) {return (180/Math.PI)*radians} 
// degrees = (180 / pi) * radians

export function fuelCircle(fuelLevel, fuelLimit) {
  var c = document.getElementById("fuelGUI");
  //c.style.alignContent = "center"
  if (c.getContext) {
    var ctx = c.getContext('2d');
    ctx.beginPath();
    //ctx.arc(50, 50,40, 0, makeRadian(90)) // 90 degrees
    // clearing the circle for an update to the canvas
    ctx.clearRect(0, 0, c.width, c.height);
    let radius = (c.width / 2)-(c.width/10);
    if (fuelLevel/fuelLimit == 0 ) {
      ctx.arc(c.width/2, c.height/2, radius, makeRadian(-90), makeRadian(-90));
    } else if (fuelLevel/fuelLimit == 1) {
      ctx.arc(c.width/2, c.height/2, radius, makeRadian(0), makeRadian(360));
    } else {
      ctx.arc(c.width/2, c.height/2, radius, Math.PI + (Math.PI *1) / 2, makeRadian((fuelLevel/fuelLimit) * 360)-makeRadian(90));
    } 
    ctx.lineWidth = 6;
    if (fuelLevel/fuelLimit > 1/3) {
      ctx.strokeStyle = '#00aa55'
    } else if (fuelLevel/fuelLimit <= 1/6) {
      ctx.strokeStyle = '#550000'
    } else if (fuelLevel/fuelLimit <= 1/3) {
      ctx.strokeStyle = '#ddaa00'
    } else {
      ctx.strokeStyle = '#00aa55'
    }
    ctx.stroke();
    ctx.font = '100% serif';
    ctx.fillStyle = '#aaaaaa'
    let textY = c.height/2 - c.height/20
    let textX = c.width/2 - c.width/20 - c.width/10
    ctx.fillText('Fuel:', textX, textY-c.height/20);
    if (fuelLevel == 0) {
      ctx.fillText(fuelLevel + "/" + fuelLimit, textX-c.width/15, textY+c.height/7);
    } else {
      ctx.fillText(fuelLevel + "/" + fuelLimit, textX-c.width/7, textY+c.height/7);
    }
  } else {
    console.log("CANVAS NOT SUPPORTED")
  }
};
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

export let menuState = 0;

export function getPosition(e) {
  var posx = 0;
  var posy = 0;
  if (!e) var e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + 
                       document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + 
                       document.documentElement.scrollTop;
  }
  return {
    x: posx,
    y: posy
  }
}

export function toggleMenuOn(menuID, menuList) {
  //console.log(menuID, menuState, "on")
  //console.log(menuList[menuID].classList)
  if ( menuState !== 1 ) {
    menuState = 1;
    let menu = menuList[menuID];
    menu.style.display = 'block';

    let menuWidth = menu.clientWidth + 4;
    let menuHeight = menu.clientHeight + 4;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let inv = document.getElementById('invID');

    // 0,0 is at the top left corner of the inventory, not the screen. 
    if (menuWidth + getPosition().x >= windowWidth ){
      menu.style.right = 0 + "px";
    } else {
      //menu.style.left = getPosition().x + 'px';
      //menu.style.left = "0px";
      menu.style.left = getPosition().x - inv.getBoundingClientRect().left + "px";
    }
    if (menuHeight + getPosition().y >= windowHeight) {
      menu.style.bottom = 0 + 'px';
    } else {
      //menu.style.top = getPosition().y + 'px';
      menu.style.top = getPosition().y - inv.getBoundingClientRect().top - menu.clientHeight + "px";
    }
    // menu coords are : 
    // (pos of pointerEvent - the position of the box as defined globally) 
    // this helps account for the offset applied by the top of the box 
    // being 0,0 child objects like cells and the menu.
    // for the edge of the inv table:
    // windowWidth - left offset of the table
  }
}

export function toggleMenuOff(menuID, menuList) {
  //console.log(menuID, menuState, "off");
  //console.log(menuList[menuID].style.display)
  if ( menuState !== 0 ) {
    menuState = 0;
    for (let i = 0; i < menuList.length; i++) {
      //console.log(i);
      //menuList[i].classList.remove(active);
      menuList[i].style.display = 'none';
    }
    //console.log(menuList[menuID].style.display)
  }
};


export function idObj(objName) {
  //console.log(objName, "A");
  let identifier = "";
  for (let i = 0; i < objName.indexOf("_"); i++){
    identifier = identifier + objName.charAt(i);
  };
  if (identifier == "wireframe") {
    
    identifier = ""; // ex: wireframe_line_0 
    for (let i = objName.length; i > objName.lastIndexOf("_"); i--) {
      //console.log(objName.charAt(i), i + "/" + objName.length);
      identifier = identifier + objName.charAt(i);
    }
    //console.log(identifier, "cId");
    //console.log(scene.children.find( (obj) => {return obj.name === objName} ))
    return scene.children.find( (obj) => {return obj.name === objName} )
    
  } else if (identifier == "turtle") {
    identifier = "";
    for (let i = objName.length; i > objName.lastIndexOf("_"); i--) {
      identifier = identifier + objName.charAt(i);
    }
    return cs_curTurtVisual
    
  } else {
    return null // not a turtle or cube
  };
}

let nameDisp = document.createElement("div");
nameDisp.className = "context-menu noSelect";
let docBod = document.getElementById("bod");
docBod.insertAdjacentElement("beforeend", nameDisp);

export function hoverInfoAppear(hoverObjName, event){
  let hoverObj = idObj(hoverObjName);
  //console.log(hoverObj)

  if (getPosition(event).y + nameDisp.clientHeight + 5 >= window.innerHeight) {
    nameDisp.bottom = 0 + "px";
  } else {
    nameDisp.style.top = event.clientY + 5 + "px";
  };
  
  if (getPosition(event).x + nameDisp.clientWidth + 5 >= window.innerWidth) {
    nameDisp.right = 0 + "px";
  } else {
    nameDisp.style.left = event.clientX + 5 + "px";
  };
  
  nameDisp.style.display = "block";
  
  if (hoverObj !== undefined) {
    if (hoverObj.name.includes("wireframe_mesh_")) {
      nameDisp.textContent = hoverObj.data
      // idk about this
    }
    else if (hoverObj.name.includes("turtle_")) {
      nameDisp.textContent = "turtle id: " + hoverObj.name.substring(7, hoverObj.name.length)
    }
    else { nameDisp.textContent = ""; }
  } else { nameDisp.textContent = ""; }
};

export function hoverInfoDisappear() {
  nameDisp.style.display = "none";
  nameDisp.textContent = "";
  nameDisp.style.top = "0px";
  nameDisp.style.left = "0px";
};

class BoundingBoxes {
  constuctor() {
    this.rEleBB = {};
    this.lEleBB = {};
    this.bckEleBB = {};
    this.upEleBB = {};
    this.dwnEleBB = {};
    this.fwdEleBB = {};
  }
  update() {
    this.rEleBB = document.getElementById("right").getBoundingClientRect();
    this.lEleBB = document.getElementById("left").getBoundingClientRect();
    this.bckEleBB = document.getElementById("backward").getBoundingClientRect();
    this.fwdEleBB = document.getElementById("forward").getBoundingClientRect();
    this.upEleBB = document.getElementById("up").getBoundingClientRect();
    this.dwnEleBB = document.getElementById("down").getBoundingClientRect();
    return this;
  }
}
  


export function makeUi() {
  // UI setup
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  let rEle = document.getElementById("right")
  let lEle = document.getElementById("left")
  let bckEle = document.getElementById("backward")
  let fwdEle = document.getElementById("forward")
  let upEle = document.getElementById("up")
  let dwnEle = document.getElementById("down")

  let boxes = new BoundingBoxes();
  boxes.update();
  
  let midBtm = (window.innerHeight / 100) + 2 + boxes.dwnEleBB.height 
  let midHeight = boxes.fwdEleBB.height + 2 + boxes.bckEleBB.height

  
  
  // baseLine
  dwnEle.style.left = (window.innerWidth / 100) + 'px'
  rEle.style.left = (window.innerWidth / 100) + 'px'
  upEle.style.left = (window.innerWidth / 100) + 'px'
  dwnEle.style.bottom = (window.innerHeight / 100) + 'px' 
  

  // up
  upEle.style.bottom = midBtm + 2 + midHeight + 'px'
  upEle.style.width = boxes.dwnEleBB.width + "px"

  // right
  rEle.style.height = midHeight + 'px'
  rEle.style.bottom = midBtm + 'px'

  // forward
  fwdEle.style.bottom = midBtm + boxes.fwdEleBB.height + 2 + "px"
  fwdEle.style.width = boxes.bckEleBB.width + 'px'
  boxes.update();
  
  // left
  lEle.style.bottom = midBtm + "px"
  lEle.style.height = midHeight + "px"

  // backward
  bckEle.style.bottom = midBtm + 'px'

  // up & down width
  upEle.style.width = (window.innerWidth / 100) + boxes.rEleBB.width + 2 + boxes.bckEleBB.width + 2 + boxes.lEleBB.width + 2 + 'px'
  dwnEle.style.width = (window.innerWidth / 100) + boxes.rEleBB.width + 2 + boxes.bckEleBB.width + 2 + boxes.lEleBB.width + 2 + 'px'


  // l and r width
  boxes.update();
  lEle.style.width = (boxes.upEleBB.width - boxes.bckEleBB.width - 4) / 2 + 'px'
  rEle.style.width = (boxes.upEleBB.width - boxes.bckEleBB.width - 4) / 2 + 'px'

  boxes.update();
  fwdEle.style.left = (window.innerWidth / 100) + boxes.rEleBB.width + 2 + "px"
  bckEle.style.left = (window.innerWidth / 100) + boxes.rEleBB.width + 2 + "px"

  boxes.update();
  lEle.style.left = boxes.fwdEleBB.left + boxes.fwdEleBB.width + 2 + 'px'
  
  // fuel disp
  let box = document.getElementsByClassName("topL")[0]
  let selected = document.getElementById("selected")
  let shiftNeg = document.getElementById("shiftNeg")
  let shiftPos = document.getElementById("shiftPos")

  selected.style.textAlign = "center"

  shiftPos.style.left = box.getBoundingClientRect().left +
                        box.getBoundingClientRect().width -
                        shiftPos.getBoundingClientRect().width
                        - 4 + 'px';
  
  box.style.bottom = document.body.height - box.getBoundingClientRect().height + "px"

  // inv 
  createInv()

  document.body.appendChild( renderer.domElement );
}


export async function createInv() {
  let inv = document.getElementById('invID');
  for (let i = 0; i < 4; i++) {
    let row = document.createElement('tr');
    for (let x = 0; x < 4; x++) {
      let cell = document.createElement('td');
      cell.className = 'invCell';
      row.appendChild(cell);
    }
    inv.appendChild(row);
  }
  return true
}

export function alterInv( cell, newText ) {
  let table = document.getElementById('invID')
  let cellList = table.getElementsByClassName('invCell')
  if (cellList[cell].parentNode) {
    cellList[cell].textContent = newText
  }
}

export function getSlot(slotNumb) {
  let table = document.getElementById('invID')
  let cellList = table.getElementsByClassName('invCell')
  //console.log(cellList[slotNumb].style)
  return cellList[slotNumb]
}


export function fillInv(invObj) {
  //console.log(invObj)
  getSlot(invObj.selectedSlot).style.color = "#222222" 
  getSlot(invObj.selectedSlot).style.backgroundColor = "#777777" 
  
  let cellList = document.getElementById('invID').getElementsByClassName('invCell');
  let menuList = [];

  // setting up the menu

  for (let i = 0; i < cellList.length; i++) {
    invObj.slots[i].count ||= 0;
    invObj.slots[i].name ||= "No item";
    alterInv(i, invObj.slots[i].count);

    
    let table = document.createElement("div");
    table.className = "context-menu";

    let itemIdDeclaration = document.createTextNode("item id:")
    table.appendChild(itemIdDeclaration);
    table.appendChild(document.createElement("br")); // newline separation for the border to work

    let itemIdInteractable = document.createElement("button");
    itemIdInteractable.className = "context-menu-item";
    itemIdInteractable.textContent = invObj.slots[i].name;
    table.insertAdjacentElement("beforeend",itemIdInteractable);
    
    //console.log(table.outerHTML);
    if (cellList[i].children[0]) {
      //console.log(cellList[i].children[0]);
      cellList[i].children[0].replaceWith(table);
    } else {
      cellList[i].insertAdjacentElement("beforeend", table);
    };
    //console.log(cellList[i].children[0]);

    menuList[i] = document.getElementsByClassName("context-menu")[i];

    try {
      cellList[i].onmouseover = handleMouseEnter.bind(null, i, cellList);
      cellList[i].onmouseout = handleMouseLeave.bind( null, i, invObj, cellList);
      //cellList[i].onclick = handleClick.bind(null, i, currentID, menuList);
      // update cells on server event
    } catch (e) {
      console.log(e);
    }
    
    // context menu 
    cellList[i].addEventListener('contextmenu', e => {
      e.preventDefault(); // prevent default rclick menu
      //console.log(getPosition());
      if (menuState == 1) { // if menu is displayed
        //console.log(getPosition(), menuState, "off");
        toggleMenuOff(i, menuList);
      } else { // if menu isnt displayed
        //console.log(getPosition(), menuState, "on");
        toggleMenuOn(i, menuList);
      };
    });
  }
}

//https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
//https://ultimatecourses.com/blog/avoiding-anonymous-javascript-functions
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
//https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#eventtarget.addeventlistener

function handleMouseLeave(i, invObj, cellList) {
  if (i == invObj.selected) {
  cellList[i].style.color = "#222222";
  cellList[i].style.backgroundColor = "#777777";
} else {
  cellList[i].style.color = "#777777";
  cellList[i].style.backgroundColor = "#222222";
}};

function handleMouseEnter(i, cellList) {
  cellList[i].style.color = "#dddddd";
  cellList[i].style.backgroundColor = "#777777";
};

function handleClick(i, currentID, menuList) {
  //cellOut(i, currentID);
  toggleMenuOff(i, menuList);
};