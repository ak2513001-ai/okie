javascript:(function () {
  if (window._bmBox) return; // prevent duplicates

  // Create container
  let box = document.createElement("div");
  box.id = "_bmBox";
  Object.assign(box.style, {
    position: "fixed",
    top: "20px",
    left: "20px",
    width: "300px",
    height: "180px",
    background: "#fff",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    fontFamily: "sans-serif",
    zIndex: 999999
  });

  // Make draggable
  box.onmousedown = function (e) {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
    let offsetX = e.clientX - box.offsetLeft;
    let offsetY = e.clientY - box.offsetTop;
    function move(ev) {
      box.style.left = ev.clientX - offsetX + "px";
      box.style.top = ev.clientY - offsetY + "px";
    }
    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  // Textarea
  let ta = document.createElement("textarea");
  Object.assign(ta.style, {
    width: "100%",
    height: "100px",
    resize: "none",
    fontSize: "12px",
    boxSizing: "border-box"
  });
  box.appendChild(ta);

  // Buttons
  let btnWrap = document.createElement("div");
  btnWrap.style.textAlign = "right";

  let execBtn = document.createElement("button");
  execBtn.textContent = "Execute";
  execBtn.style.margin = "4px";

  let clrBtn = document.createElement("button");
  clrBtn.textContent = "Clear";
  clrBtn.style.margin = "4px";

  btnWrap.appendChild(execBtn);
  btnWrap.appendChild(clrBtn);
  box.appendChild(btnWrap);
  document.body.appendChild(box);

  // Handle execution
  execBtn.onclick = async function () {
    let code = ta.value.trim();
    if (!code) return;

    // Handle GitHub links
    if (/github\.com\/.+\/blob\//.test(code)) {
      code = code
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
      try {
        let res = await fetch(code);
        code = await res.text();
      } catch (e) {
        alert("Failed to fetch from GitHub");
        return;
      }
    }
    // If raw link
    else if (/raw\.githubusercontent\.com/.test(code)) {
      try {
        let res = await fetch(code);
        code = await res.text();
      } catch (e) {
        alert("Failed to fetch raw code");
        return;
      }
    }
    try {
      new Function(code)();
    } catch (e) {
      alert("Execution error: " + e);
    }
  };

  // Handle clear
  clrBtn.onclick = function () {
    ta.value = "";
  };
})();
