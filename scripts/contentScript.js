console.log("content script injected");

let targetElement = null;
let capturingContent = false;

function handleMouseOver(event) {
    if (!capturingContent || targetElement) return;
    const { target } = event;
    target.style.outline = "3px solid red";
    targetElement = target;
}

function handleMouseOut(event) {
    const { target } = event;
    if (target === targetElement) {
        target.style.outline = "";
        targetElement = null;
    }
}

function captureElementContent() {
    if (targetElement) {
        const content = targetElement.innerText.trim();


        if (content) {
            const elementId = targetElement.id;
            const url = window.location.href;

            targetElement.style.outline = "";
            targetElement = null;
            console.log(new Date().toLocaleString("en-GB"));

            chrome.runtime.sendMessage({
                from: "contentScript",
                query: "capture_content_result",
                content: content,
                elementId: elementId,
                url: url,
                timestamp: new Date().toLocaleString("en-GB"),
            });
        } else {
            // No content to capture
            targetElement.style.outline = "";
            targetElement = null;
        }
    }
}

function handleEscapeKey(event) {
    if (event.key === "Escape") {
        targetElement.style.outline = "";
        targetElement = null;
        capturingContent = false;
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
        document.removeEventListener("click", captureElementContent);
        document.removeEventListener("keydown", handleEscapeKey);
    }
}

function handleClearButtonClicked() {
    const clearButton = document.getElementById("ClearButton");
    clearButton.addEventListener("click", () => {
        localStorage.removeItem("capturedData");
        resultList.innerHTML = ""; // Clear the content displayed in the resultList
    });
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.query === "capture_content_clicked") {
        capturingContent = true;
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);
        document.addEventListener("click", captureElementContent);
        document.addEventListener("keydown", handleEscapeKey);
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "popup" && message.query === "show_alert_clear") {
        alert("All the saved data has been cleared!");
        sendResponse({ success: true });
    }
});