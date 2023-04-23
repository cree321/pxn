"use strict";
var commit = ``;
var is_parsing = true;
const scene_repo_link = "../../z_resources/";
const scene_file_name = "demo-scene.json";
const scene_style_name = "demo-style.css";
const scene_request = new Request(scene_repo_link.concat(scene_file_name));
const style_request = new Request(scene_repo_link.concat(scene_style_name));
/* Assume scene_object has "link", "scene-layout" and "scene" properties
 */

parseMap(scene_request, style_request);

onmessage = (message) => {
  var timeout = setTimeout(() => {
    clearInterval(checker);
    //console.debug("sD: Timeout");
  }, 10100);
  var checker = setInterval(() => {
    if(!is_parsing) {
      postMessage(commit);
      clearTimeout(timeout);
      clearInterval(checker);
    }
  }, 1000);
}

function parseMap(scene_request, style_request) {
  commit = ``;
  fetch(scene_request)
    .then(response => response.json())
    .then(async scene_data => {
      var scene_style = await fetch(scene_repo_link + scene_data.link).catch(console.error);
      scene_style = await scene_style.text();
      
      //console.debug(data);
      commit += `<style>${scene_style}</style>`;//`<link rel="stylesheet" href="${data.link}"></link>`;
      scene_data["scene-layout"].forEach((room) => {
        scene_data.scene[room].forEach((value) => {
          commit += `<div class="geo ${value.c}" style="transform: translate3d(${value.t[0]}px,${value.t[1]}px,${value.t[2]}px) scale3d(${value.s[0]},${value.s[1]},${value.s[2]}) rotateX(${value.r[0]}deg) rotateY(${value.r[1]}deg);"></div>`;
        });
      });
    }).catch(console.error);
    is_parsing = false;
}
