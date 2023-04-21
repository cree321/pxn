"use strict";
const physics_delegate = new Worker("/script/engine/physicsDelegate.js");
physics_delegate.onmessage = (e) => {
  console.log(e.data.type);
  if(e.data.type) {camera.style.transform = "translateZ(800px) "+e.data.transform;}
  else {scene.style.transform = e.data.transform;}
}
const scene_delegate = new Worker("/script/engine/sceneDelegate.js");
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
}