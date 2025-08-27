// ==UserScript==
// @name         Draggable JS Executor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Floating draggable box to paste/execute JS or GitHub/raw links
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Create container elements ---
    const box = document.createElement("div");
    box.id = "jsExecutorBox";
    box.innerHTML = `
      <div id="jsExecHeader">JS Runner</div>
      <textarea id="jsExecInput" placeholder="Paste JS code or GitHub/raw link..."></textarea>
      <div id="jsExecBtnBox">
        <button id="jsExecRun">Execute</button>
        <button id="jsExecClear">Clear</button>
      </div>
    `;
    document.body.appendChild(box);

    // --- Styles ---
    const style = document.createElement("style");
    style.textContent = `
      #jsExecutorBox {
        position: fixed;
        top: 50px;
        left: 50px;
        width: 260px;
        background: #f9f9f9;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        font-family: Arial, sans-serif;
        font-size: 13px;
        z-index: 999999;
        resize: both;
        overflow: hidden;
      }
      #jsExecHeader {
        padding: 6px;
        background: #007bff;
        color: white;
        cursor: move;
        font-size: 14px;
        user-select: none;
      }
      #jsExecInput {
        width: 94%;
        height: 90px;
        margin: 6px;
        font-family: monospace;
        font-size: 13px;
      }
      #jsExecBtnBox {
        text-align: center;
        margin-bottom: 6px;
      }
      #jsExecBtnBox button {
        padding: 5px 10px;
        margin: 2px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      #jsExecRun { background: #28a745; color: white; }
      #jsExecClear { background: #dc3545; color: white; }
    `;
    document.head.appendChild(style);

    // --- Dragging logic ---
    const header = box.querySelector("#jsExecHeader");
    let dragging = false, offsetX=0, offsetY=0;

    header.addEventListener("mousedown", e=>{
        dragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
        e.preventDefault();
    });
    document.addEventListener("mousemove", e=>{
        if(dragging){
            box.style.left = (e.clientX - offsetX) + "px";
            box.style.top = (e.clientY - offsetY) + "px";
        }
    });
    document.addEventListener("mouseup", ()=> dragging = false);

    // --- Helper: turn GitHub link -> raw ---
    function toRawGithubLink(url){
        try {
            if(url.includes("github.com") && !url.includes("raw.githubusercontent.com")){
                return url
                    .replace("github.com", "raw.githubusercontent.com")
                    .replace("/blob/", "/");
            }
        } catch(e){}
        return url;
    }

    // --- Execution ---
    const textarea = box.querySelector("#jsExecInput");
    const runBtn = box.querySelector("#jsExecRun");
    const clearBtn = box.querySelector("#jsExecClear");

    runBtn.addEventListener("click", async ()=>{
        let input = textarea.value.trim();
        if(!input) return;

        // If link -> fetch & execute
        if(/^https?:\/\//i.test(input)){
            let link = toRawGithubLink(input);
            try {
                let res = await fetch(link);
                if(!res.ok) throw new Error("HTTP error " + res.status);
                let code = await res.text();
                eval(code);
            } catch(err){
                alert("Error fetching/executing: " + err);
            }
        } else {
            try {
                eval(input); // Direct code
            } catch(err){
                alert("Execution error: " + err);
            }
        }
    });

    clearBtn.addEventListener("click", ()=> textarea.value = "");
})();
