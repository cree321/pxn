"use strict";
var commit = ``;
var isParsing = 0;
const cap0ul = new Request("https://raw.githubusercontent.com/cree321/ned/master/assets/cap0/escena.json");

parseMap(cap0ul);

onmessage = (message) => {
  var timeout = setTimeout(() => {
    clearInterval(checker);
    //console.debug("sD: Timeout");
  }, 10100);
  var checker = setInterval(() => {
    if(!isParsing) {
      postMessage(commit);
      clearTimeout(timeout);
      clearInterval(checker);
    }
  }, 1000);
}

function parseMap(request) {
  commit = ``;
  fetch(request)
    .then(response => response.json())
    .then(data => {
      //console.debug(data);
      commit += `<style>.tempgrad {background-image: linear-gradient(#f00, #0f0);}</style>`;//`<link rel="stylesheet" href="${data.link}"></link>`;
      data.hall.forEach((value) => {
        commit += `<div class="geo ${value.c}" style="transform: translate3d(${value.t[0]}px,${value.t[1]}px,${value.t[2]}px) scale3d(${value.s[0]},${value.s[1]},${value.s[2]}) rotateX(${value.r[0]}deg) rotateY(${value.r[1]}deg);"></div>`;
      });
    }).catch(console.error);
}
