(function() {
    if (document.getElementById("bm-script-runner")) return;

    const container = document.createElement("div");
    container.id = "bm-script-runner";
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.left = "100px";
    container.style.width = "300px";
    container.style.height = "400px";
    container.style.background = "rgba(0,0,0,0.9)";
    container.style.color = "#fff";
    container.style.zIndex = "999999";
    container.style.border = "1px solid #333";
    container.style.borderRadius = "8px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.fontFamily = "monospace";
    container.style.overflow = "hidden";
    document.body.appendChild(container);

    const editor = document.createElement("div");
    editor.contentEditable = true;
    editor.style.flex = "1";
    editor.style.padding = "8px";
    editor.style.overflow = "auto";
    editor.style.whiteSpace = "pre";
    editor.style.outline = "none";
    editor.style.fontSize = "13px";
    container.appendChild(editor);

    const buttonBar = document.createElement("div");
    buttonBar.style.display = "flex";
    buttonBar.style.justifyContent = "space-between";
    buttonBar.style.padding = "5px";
    buttonBar.style.background = "rgba(20,20,20,0.9)";
    container.appendChild(buttonBar);

    const runBtn = document.createElement("button");
    runBtn.textContent = "Execute";
    runBtn.style.flex = "1";
    runBtn.style.marginRight = "5px";
    runBtn.style.background = "#222";
    runBtn.style.color = "#fff";
    runBtn.style.border = "none";
    runBtn.style.cursor = "pointer";
    buttonBar.appendChild(runBtn);

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear";
    clearBtn.style.flex = "1";
    clearBtn.style.background = "#222";
    clearBtn.style.color = "#fff";
    clearBtn.style.border = "none";
    clearBtn.style.cursor = "pointer";
    buttonBar.appendChild(clearBtn);

    function highlight() {
        let code = editor.innerText;
        code = code.replace(/(&)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        code = code.replace(/("(.*?)"|'(.*?)')/g, '<span style="color:#ce9178">$1</span>');
        code = code.replace(/\b(function|return|var|let|const|if|else|for|while|new|class|try|catch|await|async|throw)\b/g, '<span style="color:#569cd6">$1</span>');
        code = code.replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#569cd6">$1</span>');
        editor.innerHTML = code;
    }

    editor.addEventListener("input", () => {
        setTimeout(highlight, 0);
    });

    runBtn.onclick = async () => {
        const code = editor.innerText.trim();
        if (/^https:\/\/raw\.githubusercontent\.com\/.*\.(js|txt)$/.test(code)) {
            try {
                const res = await fetch(code);
                const text = await res.text();
                new Function(text)();
            } catch (e) {
                alert("Error loading script: " + e);
            }
        } else {
            try {
                new Function(code)();
            } catch (e) {
                alert("Error: " + e);
            }
        }
    };

    clearBtn.onclick = () => {
        editor.innerText = "";
    };

    let offsetX = 0, offsetY = 0, isDown = false;
    container.onmousedown = e => {
        isDown = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
    };
    document.onmousemove = e => {
        if (!isDown) return;
        container.style.left = (e.clientX - offsetX) + "px";
        container.style.top = (e.clientY - offsetY) + "px";
    };
    document.onmouseup = () => { isDown = false; };
})();
