"use strict";

var last_target = null;
var last_event_deltaT = 0;
// aL_editor_element.js
class ActionLayerEditor extends HTMLElement {
  constructor() {
    super();
  }

  // aL_window_control.js

doubleTapFocus;
  
  connectedCallback() { 
    this.style.display = "none";
    this.style.position = "absolute";
    this.style.touchAction = "none";
    this.style.width = "100vw";
    this.style.height = "90vh";
    this.style.top = "0px";
    this.style.left = "0px";
    const shadowDOM = this.attachShadow({ mode: "open" });
    shadowDOM.innerHTML = `<style>
    .aL {
      user-select: none;
    }
    .aL-window {
      height:40%;
    }
    .aL-paint {
      height: 60%; 
      padding: 10px;
    }
    .aL-options {
      height:20%;
    }
    .aL-canvas {
      min-height:80%;
      min-width: 70%
      position: relative;
      float: right;
      right: 0;
      border: 1px solid black;
    }
  </style>
  <div class="aL aL-window"></div>
  <div class="aL aL-paint">
    <div class="aL aL-options">
      <input class="aL undo" type="button" value="undo" />
      <input class="aL redo" type="button" value="redo" />
      <label class="aL">Import image:</label>
      <input class="aL file-import" type="file" accept="image/*,.json" />
      <a class="aL file-export" download>save</a>
      <input class="aL stroke-color" type="color" value="#000000" />
      <label class="aL">Brush weight:</label>
      <input class="aL stroke-weight" type="number" value="1" min="0.1" max="10" step="0.1" /><br>
      <label class="aL">Width:</label>
      <input class="aL texture-width" type="text" value="128px" size="6" /><br>
      <label class="aL">Height:</label>
      <input class="aL texture-height" type="text" value="128px" size="6" /><br>
      <label class="aL">Enable Grid:</label>
      <input class="aL display-grid" type="checkbox" checked />
    </div>
    <canvas class="aL aL-canvas"></canvas>
  </div>`;
  const aL_window_element = shadowDOM.querySelector(".aL-window");
  aL_window_element.addEventListener("pointerup", (event) => this.style.display = "none");

  // Event listeners not functioning?
  const aL_canvas_element = shadowDOM.querySelector(".aL-canvas");
  const aL_width_input_element = shadowDOM.querySelector(".texture-width");
  const aL_height_input_element = shadowDOM.querySelector(".texture-height");
  aL_width_input_element.onchange = (event) => aL_canvas_element.width = parseInt(aL_width_input_element.value);
  aL_height_input_element.onchange = (event) => aL_canvas_element.height = parseInt(aL_height_input_element.value);
  }

  // aL_window_control.js
doubleTapFocus = function(event) {
  const elapsed_deltaT = Date.now() - last_event_deltaT;
  if((event.target == last_target) && (elapsed_deltaT < 500)) {
    console.log(event.target);
    const aL_editor_element = document.querySelector("al-editor");
    aL_editor_element.openEditorPaint(event.target);
  } else{
    if (event.target.nodeName != "AL-EDITOR") {
      last_target = event.target;
      last_event_deltaT = Date.now();
    }
  }
}

  
// CANVAS will NOT RESIZE width/height
  openEditorPaint(target_element) {
    this.style.display = "inline-block";
    const shadowDOM = this.shadowRoot;
    const aL_canvas_element = shadowDOM.querySelector(".aL-canvas");
    const aL_width_input_element = shadowDOM.querySelector(".texture-width");
    const aL_height_input_element = shadowDOM.querySelector(".texture-height");

    
    // aL_width_input_element.onchange = (event) => aL_canvas_element.width = parseInt(aL_width_input_element.value);
    aL_width_input_element.value = target_element.style.width;
    aL_canvas_element.width = parseInt(aL_width_input_element.value)

    // aL_height_input_element.onchange = (event) => aL_canvas_element.height = parseInt(aL_height_input_element.value);
    aL_height_input_element.value = target_element.style.height;
    aL_canvas_element.height = parseInt(aL_height_input_element.value);

    console.log(aL_canvas_element.width);

// aL_editor_control.js START
  function setupPaint() {
    //const shadowDOM = this.shadowRoot;
    const aL_canvas_element = shadowDOM.querySelector(".aL-canvas");
    
    const aL_canvas_scale = parseFloat(aL_canvas_element.width) / parseFloat(aL_canvas_element.getBoundingClientRect().width);//aL_canvas_element.offsetWidth);
    const context = aL_canvas_element.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.strokeStyle = "black";
    context.lineWidth = 2;
    
    function beginPainting(event) {
      console.log("drawing now");

      context.beginPath();
      context.moveTo(event.offsetX * aL_canvas_scale, event.offsetY * aL_canvas_scale);
      aL_canvas_element.onpointermove = draw;
      aL_canvas_element.onpointerup = endPainting;
      aL_canvas_element.onpointerleave = endPainting;
      console.log("x"+ parseInt(event.offsetX * aL_canvas_scale) +", y"+ parseInt(event.offsetY * aL_canvas_scale));
      console.log(parseFloat(aL_canvas_element.getBoundingClientRect().width) +"/"+ parseFloat(aL_canvas_element.offsetWidth) +" = "+aL_canvas_scale);
      if(event.isPrimary) {
        
      }
    }
    function resumePainting(event) {
      if(event.isPrimary) {
        context.moveTo(event.clientX, event.clientY);
        context.beginPath();
      }
    }
    function draw(event) {
      event.preventDefault();
      context.lineTo(event.offsetX * aL_canvas_scale, event.offsetY * aL_canvas_scale);
      context.stroke();
      //context.beginPath();
      console.log("drawing...");
    }
    function endPainting(event) {
      aL_canvas_element.onpointermove = null;
      aL_canvas_element.onpointerup = null;
      aL_canvas_element.onpointerleave = null;
      context.closePath();
      console.log("done drawing");

      const canvas_data = aL_canvas_element.toDataURL("image/png");
      console.log(canvas_data);
      shadowDOM.querySelector(".file-export").href = canvas_data;
      target_element.style.backgroundImage = `url(${canvas_data})`;
    }
    aL_canvas_element.onpointerdown = beginPainting;
    //aL_canvas_element.onpointerenter = resumePainting;
  }
// aL_editor_control.js END
    
    //const context = aL_canvas_element.getContext("2d");
    //context.fillStyle = "blue";
    setupPaint();
  }
}

customElements.define("al-editor", ActionLayerEditor);

// // aL_window_control.js
// var last_target;
// var last_event_deltaT;
// function doubleTapFocus(event) {
//   const elapsed_deltaT = Date.now() - last_event_deltaT;
//   if((event.target == last_target) && (elapsed_deltaT < 500)) {
//     const aL_editor_element = document.querySelector("al-editor");
//     aL_editor_element.openEditorPaint(event.target);
//   } else{
//     last_target = event.target;
//     last_event_deltaT = Date.now();
//   }
// }

window.addEventListener("load", (e) => {
  if(!document.querySelector("al-editor")) {
    console.log("added")
    document.body.innerHTML += "<al-editor></al-editor>";
  }
  const canvas = document.querySelector("al-editor");
  document.addEventListener("pointerup", canvas.doubleTapFocus);
});
