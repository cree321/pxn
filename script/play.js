"use strict";
const physics_delegate = new Worker("/pxn/script/engine/physicsDelegate.js");
physics_delegate.onmessage = (e) => {
  console.debug(e.data.type);
  if(e.data.type) {camera.style.transform = "translateZ(800px) "+e.data.transform;}
  else {scene.style.transform = e.data.transform;}
}
const scene_delegate = new Worker("/pxn/script/engine/sceneDelegate.js");
scene_delegate.onmessage = (e) => {scene.innerHTML = e.data;}

window.onload = (event) => {
  const viewport = document.getElementById("viewport");
  const camera = document.getElementById("camera");
  const scene = document.getElementById("scene");

    scene_delegate.postMessage(null);
    window.addEventListener("keydown", (e) => {
      if(!e.repeat)
        physics_delegate.postMessage({type: 1, code: e.code});
    });
    window.addEventListener("keyup", (e) => {
      physics_delegate.postMessage({type: 0, code: e.code})
    });


    const control_move = document.getElementById("controlUI_move");
    // const control_look = document.getElementById("controlUI_look");
    // const control_place = document.getElementById("controlUI_place");
    // const control_destroy = document.getElementById("controlUI_destroy");

    window.addEventListener("pointermove", (e) => {
      // switch(e.target.id)
      // {
      //   case "controlUI_look":

      // }
      physics_delegate.postMessage({type: 2, movementX: e.movementX, movementY: e.movementY})
    });
    control_move.addEventListener("pointerdown", (e) => {
      console.log(`${e.offsetX}, ${e.offsetY}`)
      e.stopPropagation();
      //physics_delegate.postMessage({type: 2, movementX: e.movementX, movementY: e.movementY})
    });
    control_move.addEventListener("pointerup", (e) => {
      e.stopPropagation();
      //physics_delegate.postMessage({type: 2, movementX: e.movementX, movementY: e.movementY})
    });
}
