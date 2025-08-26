(function () {
    if (document.getElementById("bm-script-runner")) return;

    const container = document.createElement("div");
    container.id = "bm-script-runner";
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.left = "100px";
    container.style.width = "350px";
    container.style.height = "450px";
    container.style.background = "rgba(0,0,0,0.85)";
    container.style.color = "#fff";
    container.style.zIndex = "999999";
    container.style.border = "1px solid #333";
    container.style.borderRadius = "10px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.fontFamily = "monospace";
    document.body.appendChild(container);

    const editorWrapper = document.createElement("div");
    editorWrapper.style.flex = "1";
    editorWrapper.style.display = "flex";
    editorWrapper.style.overflow = "hidden";
    container.appendChild(editorWrapper);

    const lineNumbers = document.createElement("div");
    lineNumbers.style.background = "rgba(20,20,20,0.9)";
    lineNumbers.style.padding = "5px";
    lineNumbers.style.textAlign = "right";
    lineNumbers.style.userSelect = "none";
    lineNumbers.style.color = "#888";
    lineNumbers.style.minWidth = "30px";
    lineNumbers.style.whiteSpace = "pre";
    lineNumbers.textContent = "1";
    editorWrapper.appendChild(lineNumbers);

    const editor = document.createElement("pre");
    editor.contentEditable = "true";
    editor.style.flex = "1";
    editor.style.margin = "0";
    editor.style.padding = "5px";
    editor.style.overflow = "auto";
    editor.style.whiteSpace = "pre";
    editor.style.outline = "none";
    editor.style.fontSize = "13px";
    editor.style.color = "#fff";
    editor.style.background = "transparent";
    editorWrapper.appendChild(editor);

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

    function updateLineNumbers() {
        const lines = editor.innerText.split("\n").length;
        lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    }

    function highlight() {
        let text = editor.innerText;
        text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        text = text.replace(/("(.*?)"|'(.*?)')/g, '<span style="color:#ce9178">$1</span>');
        text = text.replace(/\b(function|return|var|let|const|if|else|for|while|new|class|try|catch|await|async|throw)\b/g, '<span style="color:#569cd6">$1</span>');
        text = text.replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#569cd6">$1</span>');
        editor.innerHTML = text.replace(/\n/g, "<br>");
        placeCaretAtEnd(editor);
    }

    function placeCaretAtEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    editor.addEventListener("input", () => {
        updateLineNumbers();
        highlight();
    });

    function convertGitHubToRaw(url) {
        if (url.includes("github.com") && url.includes("/blob/")) {
            return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
        }
        return url;
    }

    runBtn.onclick = async () => {
        const code = editor.innerText.trim();
        if (/(githubusercontent\.com|github\.com).*\.(js|txt)$/.test(code)) {
            const rawUrl = convertGitHubToRaw(code);
            try {
                const res = await fetch(rawUrl);
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
        updateLineNumbers();
    };

    let offsetX = 0, offsetY = 0, isDown = false;
    container.addEventListener("mousedown", e => {
        isDown = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
    });
    document.addEventListener("mousemove", e => {
        if (!isDown) return;
        container.style.left = (e.clientX - offsetX) + "px";
        container.style.top = (e.clientY - offsetY) + "px";
    });
    document.addEventListener("mouseup", () => { isDown = false; });

    updateLineNumbers();
})();
