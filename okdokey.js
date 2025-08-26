(function() {
    if (document.getElementById("bm-script-runner")) return;

    // Create container
    const container = document.createElement("div");
    container.id = "bm-script-runner";
    container.style.position = "fixed";
    container.style.top = "50px";
    container.style.left = "50px";
    container.style.width = "400px";
    container.style.height = "300px";
    container.style.background = "#1e1e1e";
    container.style.color = "#fff";
    container.style.zIndex = "999999";
    container.style.border = "2px solid #555";
    container.style.borderRadius = "8px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.resize = "both";
    container.style.overflow = "hidden";
    document.body.appendChild(container);

    // Title bar (draggable)
    const titleBar = document.createElement("div");
    titleBar.style.background = "#333";
    titleBar.style.cursor = "move";
    titleBar.style.padding = "5px";
    titleBar.style.fontWeight = "bold";
    titleBar.textContent = "Bookmarklet Runner";
    container.appendChild(titleBar);

    // Editor wrapper (with line numbers + textarea)
    const editorWrapper = document.createElement("div");
    editorWrapper.style.flex = "1";
    editorWrapper.style.display = "flex";
    editorWrapper.style.overflow = "hidden";
    container.appendChild(editorWrapper);

    // Line numbers
    const lineNumbers = document.createElement("div");
    lineNumbers.style.background = "#252526";
    lineNumbers.style.padding = "5px";
    lineNumbers.style.textAlign = "right";
    lineNumbers.style.userSelect = "none";
    lineNumbers.style.fontFamily = "monospace";
    lineNumbers.style.color = "#888";
    lineNumbers.style.minWidth = "30px";
    lineNumbers.style.whiteSpace = "pre";
    lineNumbers.textContent = "1";
    editorWrapper.appendChild(lineNumbers);

    // Textarea
    const textarea = document.createElement("textarea");
    textarea.style.flex = "1";
    textarea.style.background = "#1e1e1e";
    textarea.style.color = "#fff";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.padding = "5px";
    textarea.style.fontFamily = "monospace";
    textarea.style.fontSize = "14px";
    textarea.style.lineHeight = "1.4em";
    textarea.spellcheck = false;
    editorWrapper.appendChild(textarea);

    // Buttons
    const buttonBar = document.createElement("div");
    buttonBar.style.background = "#333";
    buttonBar.style.padding = "5px";
    buttonBar.style.display = "flex";
    buttonBar.style.justifyContent = "space-between";
    container.appendChild(buttonBar);

    const runBtn = document.createElement("button");
    runBtn.textContent = "Execute";
    runBtn.style.padding = "5px 10px";
    runBtn.style.cursor = "pointer";
    buttonBar.appendChild(runBtn);

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.style.padding = "5px 10px";
    clearBtn.style.cursor = "pointer";
    buttonBar.appendChild(clearBtn);

    // Update line numbers dynamically
    textarea.addEventListener("input", () => {
        const lines = textarea.value.split("\n").length;
        lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    });
    textarea.addEventListener("scroll", () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    });

    // Execute button
    runBtn.onclick = () => {
        try {
            new Function(textarea.value)();
        } catch (err) {
            alert("Error: " + err);
        }
    };

    // Clear button
    clearBtn.onclick = () => {
        textarea.value = "";
        lineNumbers.textContent = "1";
    };

    // Make draggable
    (function makeDraggable(el, handle) {
        let offsetX = 0, offsetY = 0, isDown = false;

        handle.onmousedown = function(e) {
            isDown = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            document.onmousemove = mouseMove;
            document.onmouseup = mouseUp;
        };

        function mouseMove(e) {
            if (!isDown) return;
            el.style.left = (e.clientX - offsetX) + "px";
            el.style.top = (e.clientY - offsetY) + "px";
        }

        function mouseUp() {
            isDown = false;
            document.onmousemove = null;
            document.onmouseup = null;
        }
    })(container, titleBar);

})();
