(function () {
    if (document.getElementById("bm-script-runner")) return;

    const container = document.createElement("div");
    container.id = "bm-script-runner";
    Object.assign(container.style, {
        position: "fixed",
        top: "100px",
        left: "100px",
        width: "350px",
        height: "450px",
        background: "rgba(0,0,0,0.9)",
        color: "#fff",
        zIndex: "999999",
        border: "1px solid #333",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        overflow: "hidden",
        userSelect: "none"
    });
    document.body.appendChild(container);

    const editorWrapper = document.createElement("div");
    Object.assign(editorWrapper.style, {
        flex: "1",
        display: "flex",
        overflow: "hidden",
        background: "rgba(15,15,15,0.95)",
        fontSize: "13px"
    });
    container.appendChild(editorWrapper);

    const lineNumbers = document.createElement("div");
    Object.assign(lineNumbers.style, {
        background: "rgba(20,20,20,0.9)",
        padding: "5px",
        textAlign: "right",
        color: "#888",
        minWidth: "30px",
        whiteSpace: "pre",
        fontSize: "13px"
    });
    lineNumbers.textContent = "1";
    editorWrapper.appendChild(lineNumbers);

    const textarea = document.createElement("textarea");
    Object.assign(textarea.style, {
        flex: "1",
        margin: "0",
        padding: "5px",
        border: "none",
        outline: "none",
        resize: "none",
        color: "transparent",
        caretColor: "#fff",
        background: "transparent",
        fontFamily: "monospace",
        fontSize: "13px",
        lineHeight: "1.4em",
        zIndex: "2",
        position: "relative"
    });
    editorWrapper.appendChild(textarea);

    const highlightLayer = document.createElement("pre");
    Object.assign(highlightLayer.style, {
        position: "absolute",
        margin: "0",
        padding: "5px",
        pointerEvents: "none",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: "13px",
        lineHeight: "1.4em",
        color: "#fff",
        width: "calc(100% - 40px)",
        height: "100%",
        zIndex: "1"
    });
    editorWrapper.style.position = "relative";
    editorWrapper.appendChild(highlightLayer);

    const buttonBar = document.createElement("div");
    Object.assign(buttonBar.style, {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
        background: "rgba(20,20,20,0.9)"
    });
    container.appendChild(buttonBar);

    function makeBtn(label) {
        const b = document.createElement("button");
        b.textContent = label;
        Object.assign(b.style, {
            flex: "1",
            margin: "0 2px",
            background: "#222",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
        });
        return b;
    }

    const runBtn = makeBtn("Execute");
    const clearBtn = makeBtn("Clear");
    buttonBar.appendChild(runBtn);
    buttonBar.appendChild(clearBtn);

    function updateLineNumbers() {
        const lines = textarea.value.split("\n").length;
        lineNumbers.textContent = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    }

    function highlight() {
        let code = textarea.value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        code = code.replace(/("(.*?)"|'(.*?)')/g, '<span style="color:#ce9178">$1</span>');
        code = code.replace(/\b(function|return|var|let|const|if|else|for|while|new|class|try|catch|await|async|throw)\b/g, '<span style="color:#569cd6">$1</span>');
        code = code.replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#569cd6">$1</span>');
        highlightLayer.innerHTML = code;
    }

    textarea.addEventListener("input", () => {
        updateLineNumbers();
        highlight();
    });
    textarea.addEventListener("scroll", () => {
        highlightLayer.scrollTop = textarea.scrollTop;
        lineNumbers.scrollTop = textarea.scrollTop;
    });

    function convertGitHubToRaw(url) {
        if (url.includes("github.com") && url.includes("/blob/")) {
            return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
        }
        return url;
    }

    runBtn.onclick = async () => {
        const code = textarea.value.trim();
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
        textarea.value = "";
        highlightLayer.innerHTML = "";
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
