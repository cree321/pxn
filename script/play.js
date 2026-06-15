"use strict";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/pxn/sw.js", {scope: "/pxn/"});
}


const physics_delegate = new Worker("/pxn/script/engine/physicsDelegate.js");
physics_delegate.onmessage = (e) => {
  //console.debug(e.data.type);
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

    //joystick move control reference points
    const control_move = document.querySelector("#controlUI-move");
    const joystick_center = document.querySelector("#joy-center");
    joystick_center.scrollIntoView({block:"start", inline:"start"});
    const ctrl_joy_maxX = control_move.scrollLeft /2;
    const ctrl_joy_maxY = control_move.scrollTop /2;

  joystick_center.scrollIntoView({block:"center", inline:"center"});
  const ctrl_joy_centerX = control_move.scrollLeft;
  const ctrl_joy_centerY = control_move.scrollTop;
    // const control_look = document.getElementById("controlUI_look");
    // const control_place = document.getElementById("controlUI_place");
    // const control_destroy = document.getElementById("controlUI_destroy");

    window.addEventListener("pointermove", (e) => {
      if(e.target === control_move_center) return;
      // switch(e.target.id)
      // {
      //   case "controlUI_look":

      // }
      e.preventDefault();
      physics_delegate.postMessage({type: 2, movementX: e.movementX, movementY: e.movementY})
    });
    control_move.addEventListener("scroll", (e) => {
      
      //console.debug(`${e.offsetX - ctrl_mv_w}, ${e.offsetY - ctrl_mv_h}`);
      e.stopPropagation();
      physics_delegate.postMessage({
        type: 3,
        movementX: (ctrl_joy_centerX - e.target.scrollLeft)/ctrl_joy_maxX,
        movementY: (e.target.scrollTop - ctrl_joy_centerY)/ctrl_joy_maxY
      });
    });
    control_move.addEventListener("scrollend", (e) => {
      e.stopPropagation();
      physics_delegate.postMessage({type: 3, movementX: 0, movementY: 0});
      joystick_center.scrollIntoView({block:"center", inline:"center"});
    });
}
