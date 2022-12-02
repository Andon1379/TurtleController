import * as THREE from 'https://cdn.skypack.dev/three@v0.132.2';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
//import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
// unused
import Stats from 'https://cdn.skypack.dev/stats.js.fps';

import {hoverInfoAppear, hoverInfoDisappear, idObj} from "/modules/gui.js";

export let meshList;
// why am I using meshlist? depreciate this later. 
export let camera, scene, renderer;
export let orbit;
export let raycaster, mouse;
var stats

export function fpsShow() {
  stats.dom.style.display = 'block';//.setAttribute('style', 'display: block;')
}
export function fpsClose() {
  stats.dom.style.display = 'none';//.setAttribute('style', 'display: none;')iiii
}

export function init(){
  meshList = []
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setScissorTest(true);
  renderer.setScissor(0,0, window.innerWidth, window.innerHeight);

  // fps counter

  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom)


  document.body.appendChild( renderer.domElement );
  
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enablePan = false; 
  //orbit.update() must be called after any manual changes to the camera's transform
  camera.position.set( 2, 2, 2 );
  orbit.update();
}
init();
fpsClose();

export function removeCube(obj) {
  try {
    //console.log(obj.mesh.name.slice(0,6) == "turtle")
    //console.log(scene.children.length, meshList.length)
    //console.log(renderer.info.render.triangles, renderer.info.memory.geometries, renderer.getScissorTest())
  
    if (obj.mesh.name.slice(0,6) === "turtle") {
      let meshName = obj.mesh.name
      let selectedObject = scene.getObjectByName(meshName);
      
      //console.log(selectedObject.geometry, selectedObject.material)
      
      scene.remove( selectedObject );
      selectedObject.geometry.dispose();
      selectedObject.material.forEach((m)=>{m.dispose();})

      meshList.splice(meshList.indexOf(obj), 1);
      
    } else {
      let mesh = scene.getObjectByName(obj.mesh.name);    
      let line = scene.getObjectByName(obj.line.name);
  
      scene.remove( mesh, line );
      
      mesh.geometry.dispose();
      mesh.material.dispose();
  
      line.geometry.dispose();
      line.material.dispose();

      meshList.splice(meshList.indexOf(obj), 1);
    }
    //console.log(`s\n`, scene.children)
    //console.log(`m\n`, meshList)
  } catch (e) {
    console.log(e);
    console.log(`\n`);
  }

  animate();
  // unfortunatley, these objects still exist to some extent. (i think?)
  // I could not figure out how to completley remove them 
}

// create turtleMesh ONCE, refrence as needed. DO NOT CHANGE THIS
// that includes disposing of it. 
function makeTurtleMesh() {
  const geometry = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
  const loader = new THREE.TextureLoader();
  const material = [
    new THREE.MeshBasicMaterial( { map: loader.load('textures/pz.png') } ),
    new THREE.MeshBasicMaterial( { map: loader.load('textures/nz.png') } ),
    new THREE.MeshBasicMaterial( { map: loader.load('textures/py.png') } ),
    new THREE.MeshBasicMaterial( { map: loader.load('textures/ny.png') } ),
    new THREE.MeshBasicMaterial( { map: loader.load('textures/nx.png') } ),
    new THREE.MeshBasicMaterial( { map: loader.load('textures/px.png') } )
    // 16x16 v 256x256 (this is why the texures are dodgy)
    // z - y - x, positive then negative
    // the pickaxe should be on the left side
  ]
  return new THREE.Mesh( geometry, material );
}
let turtleMesh = makeTurtleMesh();

// similarly, create a shared geometry for blocks
let blockGeometry = new THREE.BoxGeometry( 1, 1, 1 );
let wireframeGeometry = new THREE.EdgesGeometry( blockGeometry );


// rendering cubes would be more efficent if we had them all as one shape, or at least connected ones of the same type. 
export function visualizeCube(cubeObj) {
  //console.log(cubeObj)
  if (cubeObj._type == "turtle") { // if turtle
		let mesh = turtleMesh;
    
    mesh.name = cubeObj.name
    scene.add( mesh );
    mesh.position.x = cubeObj.x;
    mesh.position.y = cubeObj.y;
    mesh.position.z = cubeObj.z;
    meshList[meshList.length] = mesh; // add mesh to meshlist to perhaps be deleted later

    //console.log(scene.children)
    return {mesh: mesh, name: cubeObj.name, line: null, meshListPos: meshList.length - 1 }    
  } else if (cubeObj._type == "cube" || cubeObj._type == null) { // if cube, assume cube if nothing
    // give normal cubes a wireframe and a transparent box w/ color
    
    // box
    const geometry = blockGeometry;
    const material = new THREE.MeshBasicMaterial( { color: cubeObj.color, transparent: true, opacity: 0.5 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = "wireframe_mesh_"+ cubeObj.name
    scene.add( mesh );
    mesh.position.x = cubeObj.x;
    mesh.position.y = cubeObj.y;
    mesh.position.z = cubeObj.z;
    mesh.data = cubeObj.data;
    meshList[meshList.length] = mesh;
     
    //wireframe
    const edges = wireframeGeometry;
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: cubeObj.color } ) ); 
    line.name = "wireframe_line_"+ cubeObj.name
    scene.add( line );
    line.position.x = cubeObj.x;
    line.position.y = cubeObj.y;
    line.position.z = cubeObj.z;

    //console.log(scene.children)
    return {mesh: mesh, name: cubeObj.name, line: line, meshListPos: meshList.length - 1 }
  }
  // for turtles: 
  //   can remove:
  //     mesh from scene
  //     mesh attached to turtle -- maybe not 
  // for cubes:
  //   can remove: 
  //     box mesh, line from scene
  //     geometry, material from box mesh
  //     edges, material, from line
}

export function rotate(object, radians) {
  object.mesh.setRotationFromQuaternion( // set objects rotation
    new THREE.Quaternion().setFromAxisAngle( // new quaternion
      new THREE.Vector3( 0, 1, 0 ), // axial vector to rotate on
      radians // angle to rotate by (rad)
    )
  )
}

window.onmousemove = (event) => {//function onMouseMove( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  setTimeout(() => {
    //console.log(hoverObj.object)
    if (hoverObj.object instanceof THREE.Mesh) {
      //console.log(hoverObj.object)
      if (oldHoverObj.object == hoverObj.object) {
        //console.log("hoverStatus:", true, "equal");
        hoverInfoAppear(oldHoverObj.object.name, event);
      } else {
        //console.log("hoverStatus:", false, hoverObj);
        hoverInfoDisappear();
        oldHoverObj = hoverObj;
      }
    } else {
      //console.log("hoverStatus:", false, "b");
      hoverInfoDisappear();
    }
    
    //console.log(hoverObj.object instanceof THREE.Mesh, hoverObj.object)
    //hoverInfoAppear("", event)
  }, 50 );
}



let hoverObj;
hoverObj = {};
hoverObj.object = {};
hoverObj.object.name = "";
//console.log(hoverObj);
let oldHoverObj = {object:{name:""}};

function render() {
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera(mouse, camera);
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(meshList); 
  // is looking specifically in a list of the meshes (was originally scene.children)
  // put it back to scene.children because that's what Im doing garbage
  // collection on anyways
  try {
    if (intersects.length > 0) {
      //console.log(intersects)
      
      //console.log(intersects[0].object.name)
      
      // lot of items intersecting here...
      // maybe some of them are un needed?
      // seems to happen most with cubes (specifically wireframes)
      let interObj = intersects.find( (e) => {
        if (!e.object.name.startsWith("wireframe_line_")) {
          //console.log(e.object.name, e.point)
          //console.log(e) 
          return true;
          
        }
      })
      
      //console.log(interObj?.object?.name) 
      // if intersected object exists
      if (typeof interObj !== "undefined") {
        //console.log(interObj)
        if (hoverObj.object.name != interObj.object.name) {
          // if objects are different, overwrite
          hoverObj = interObj;
        } else {
          // if objs are the same, reset
          //hoverObj = {object:{name:""}};
          // actually that makes no sense?
        } 
        //console.log(interObj, hoverObj)
        //console.log(interObj.object instanceof THREE.Mesh, interObj.object.name)
      } else {
        // if intersected object is nothing, reset
        hoverObj = {object:{name:""}};
        //console.log("a")
      }
      
    } else { hoverObj = {object:{name:""}}; }
   
  } catch (e){
    console.log(e);
    //console.log(hoverObj.object.name, intersects[0].object.name);
    hoverObj = {};
    hoverObj.object = {};
    hoverObj.object.name = "";
  }
	//for ( let i = 0; i < intersects.length; i ++ ) {
		//console.log(intersects[i].object.name);
	//}
  // rendering the scene after this anyways!
	//renderer.render( scene, camera );

}

export function cTarget(targetCube, oldTar, fov = 70) {
  // pass in old position before change
  //let oldTar = orbit.target;
  
  if (oldTar == undefined) {
    oldTar = {x:0, y:0, z:0}
  } else if (oldTar.mesh != undefined) {
    oldTar = oldTar.mesh.position;
  } else {
    oldTar = oldTar;
  }
  
  //console.log(camera.position, targetCube.mesh.position, oldTar)
  let camPos = camera.position;
  
  let newPos = new THREE.Vector3(
    (camPos.x - oldTar.x) + targetCube.mesh.position.x,
    (camPos.y - oldTar.y) + targetCube.mesh.position.y, 
    (camPos.z - oldTar.z) + targetCube.mesh.position.z
  );
  
  
  try { 
    camera.position.set(newPos.x, newPos.y, newPos.z);
  } catch (e) { console.log(e); };
  //console.log(camera.position, targetCube.mesh.position, oldTar)
  
  orbit.target = targetCube.mesh.position;
  camera.fov = 70;
  orbit.update();
}


function animate() {

  stats.begin()
  //requestAnimationFrame( render );
  // if we call render() as a callback, why are we running it again?
  render();

	// required if orbit.enableDamping or orbit.autoRotate are set to true
	orbit.update();

	renderer.render( scene, camera );
  
  stats.end()
  //stats.update()
	requestAnimationFrame( animate );
  // console.log(stats.fps)

}

animate();
