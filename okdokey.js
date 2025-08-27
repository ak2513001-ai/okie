<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Draggable JS Executor</title>
  <style>
    #jsContainer {
      position: fixed;
      top: 50px;
      left: 50px;
      width: 280px;
      background: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      z-index: 9999;
      resize: both;
      overflow: hidden;
    }
    #headerBar {
      padding: 6px;
      background: #007bff;
      color: white;
      cursor: move;
      font-size: 14px;
    }
    #codeInput {
      width: 95%;
      height: 100px;
      margin: 6px;
      font-family: monospace;
      font-size: 13px;
    }
    #btnBox {
      text-align: center;
      margin-bottom: 6px;
    }
    #btnBox button {
      padding: 6px 10px;
      margin: 2px;
      font-size: 13px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    #executeBtn { background: #28a745; color:white; }
    #clearBtn { background: #dc3545; color:white; }
  </style>
</head>
<body>
  
<div id="jsContainer">
  <div id="headerBar">JS Runner</div>
  <textarea id="codeInput" placeholder="Paste JS code or GitHub/raw link..."></textarea>
  <div id="btnBox">
    <button id="executeBtn">Execute</button>
    <button id="clearBtn">Clear</button>
  </div>
</div>

<script>
(function(){
  const box = document.getElementById("jsContainer");
  const header = document.getElementById("headerBar");
  const textarea = document.getElementById("codeInput");
  const execBtn = document.getElementById("executeBtn");
  const clearBtn = document.getElementById("clearBtn");

  // --- Make draggable ---
  let offsetX=0, offsetY=0, dragging=false;
  header.addEventListener("mousedown", e=>{
    dragging = true;
    offsetX = e.clientX - box.offsetLeft;
    offsetY = e.clientY - box.offsetTop;
  });
  document.addEventListener("mousemove", e=>{
    if(dragging){
      box.style.left = (e.clientX - offsetX) + "px";
      box.style.top = (e.clientY - offsetY) + "px";
    }
  });
  document.addEventListener("mouseup", ()=> dragging=false);

  // --- GitHub link normalization ---
  function toRawGithubLink(url){
    try {
      if(url.includes("github.com") && !url.includes("raw.githubusercontent.com")){
        return url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
      }
    } catch(e){ console.error(e); }
    return url;
  }

  // --- Execute Button ---
  execBtn.addEventListener("click", async ()=>{
    let input = textarea.value.trim();
    if(!input) return;

    // If it's a URL, handle fetching
    if(/^https?:\/\//i.test(input)){
      let link = toRawGithubLink(input);
      try {
        let res = await fetch(link);
        if(!res.ok) throw new Error("HTTP error " + res.status);
        let code = await res.text();
        eval(code); // Execute fetched code
      } catch(err){
        alert("Error fetching/executing: " + err);
      }
    } else {
      try {
        eval(input); // Direct JS or bookmarklet
      } catch(err){
        alert("Execution error: " + err);
      }
    }
  });

  // --- Clear Button ---
  clearBtn.addEventListener("click", ()=> textarea.value = "");
})();
</script>
</body>
</html>
