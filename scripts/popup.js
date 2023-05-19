window.addEventListener("DOMContentLoaded", () => {
    const resultList = document.getElementById("result");
    const capturedData = JSON.parse(localStorage.getItem("capturedData"));
    let tab;

    // Function to filter captured data based on the current website
    const filterCapturedData = (tab) => {
        const currentWebsiteCaptures = capturedData.filter(item => item.url === tab.url);
        resultList.innerHTML = ""; // Clear the current content
        renderCapturedData(currentWebsiteCaptures);
    };

    // Function to render the captured data
    const renderCapturedData = (data) => {
        resultList.innerHTML = ""; // Clear the current content

        if (data && Array.isArray(data)) {
            data.forEach(item => {
                const textblock = document.createElement("div");
                textblock.classList.add("textblock");

                textblock.addEventListener("click", () => {
                    navigator.clipboard.writeText(item.content)
                        .then(() => {
                            console.log("Content copied to clipboard:", item.content);
                        })
                        .catch(error => {
                            console.error("Failed to copy content to clipboard:", error);
                        });
                });

                const contentLabel = document.createElement("span");
                contentLabel.classList.add("label");
                contentLabel.innerText = "Content: ";

                const contentText = document.createElement("span");
                contentText.innerText = item.content;

                const idLabel = document.createElement("span");
                idLabel.classList.add("label");
                idLabel.innerText = "id: ";

                const idText = document.createElement("span");
                idText.innerText = item.elementId;

                const urlLabel = document.createElement("span");
                urlLabel.classList.add("label");
                urlLabel.innerText = "URL: ";

                const urlText = document.createElement("span");
                urlText.classList.add("clickable-url");
                urlText.innerText = item.url;
                urlText.addEventListener("click", () => {
                    chrome.tabs.create({ url: item.url });
                });

                const timestampLabel = document.createElement("span");
                timestampLabel.classList.add("label");
                timestampLabel.innerText = "Timestamp: ";

                const timestampText = document.createElement("span");
                timestampText.innerText = item.timestamp;


                // Create the textblock_btndiv div
                const textblock_btndiv = document.createElement("div");
                textblock_btndiv.classList.add("textblock_btndiv");

                // Create the clear button
                const clearButton = document.createElement("button");
                clearButton.innerText = "Clear";
                clearButton.addEventListener("click", () => {
                    // Remove the item from capturedData
                    const index = capturedData.findIndex(i => i.content === item.content);
                    if (index !== -1) {
                        capturedData.splice(index, 1);
                        localStorage.setItem("capturedData", JSON.stringify(capturedData));
                    }

                    // Remove the textblock div from the result list
                    resultList.removeChild(textblock);
                });

                // Create the load button
                const loadButton = document.createElement("button");
                loadButton.innerText = "Imagine";
                loadButton.addEventListener("click", () => {
                    // Load the new page with the same content
                    const newPageUrl = `newpage.html?content=${encodeURIComponent(item.content)}`;
                    window.location.href = newPageUrl;
                });

                // Append the buttons to the textblock_btndiv
                textblock_btndiv.appendChild(clearButton);
                textblock_btndiv.appendChild(loadButton);

                textblock.appendChild(contentLabel);
                textblock.appendChild(contentText);
                textblock.appendChild(document.createElement("br"));
                if (item.elementId) {
                    textblock.appendChild(idLabel);
                    textblock.appendChild(idText);
                    textblock.appendChild(document.createElement("br"));
                }
                textblock.appendChild(urlLabel);
                textblock.appendChild(urlText);
                textblock.appendChild(document.createElement("br"));
                textblock.appendChild(timestampLabel);
                textblock.appendChild(timestampText);

                textblock.appendChild(document.createElement("br"));
                textblock.appendChild(textblock_btndiv);

                // Append the textblock to the resultList
                resultList.appendChild(textblock);
            });
        }
    };

    // Show all captured data initially
    renderCapturedData(capturedData);


    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        if (
            tab.url === undefined ||
            tab.url.indexOf("chrome") === 0 ||
            tab.url.indexOf("file") === 0
        ) {
            const errorSpan = document.getElementById("error_span");
            errorSpan.innerHTML = "Content Picker";
            const errorText = document.createElement("i");
            errorText.innerHTML = " can't access ";
            if (tab.url.indexOf("chrome") === 0) {
                errorText.innerHTML += "<i>Chrome pages</i>";
            } else {
                errorText.innerHTML += "<i>local pages</i>";
            }
            const errorContainer = document.getElementById("error_cont");
            errorContainer.appendChild(errorText);
            return;
        }

        const button = document.createElement("button");
        button.setAttribute("id", "picker_btn");
        button.innerText = "Capture Element Content";

        button.addEventListener("click", () => {
            chrome.tabs.sendMessage(tabs[0].id, {
                from: "popup",
                query: "capture_content_clicked",
            });
        });

        const buttonCont = document.getElementById("picker_btn_cont");
        buttonCont.appendChild(button);

        const clearButton = document.getElementById("ClearButton");
        clearButton.addEventListener("click", () => {
            localStorage.clear();
            resultList.innerHTML = ""; // Clear the content displayed in the resultList

            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                const tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, { from: "popup", query: "show_alert_clear" });
            });
        });

        const showCurrentSiteOnlyButton = document.getElementById("showCurrentSiteOnly");
        showCurrentSiteOnlyButton.addEventListener("click", () => {
            filterCapturedData(tab); // Pass the tab variable as an argument
        });

        const showAllButton = document.getElementById("showAllsites");
        showAllButton.addEventListener("click", () => {
            renderCapturedData(capturedData);
        }
        );


    });


});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
        message.from === "contentScript" &&
        message.query === "capture_content_result"
    ) {
        const capturedContent = message.content;
        const elementId = message.elementId;
        const url = message.url;
        const resultList = document.getElementById("result");

        const capturedData = JSON.parse(localStorage.getItem("capturedData")) || [];
        const newItem = {
            content: capturedContent,
            elementId: elementId,
            url: url,
            timestamp: message.timestamp,
        };
        capturedData.push(newItem);
        localStorage.setItem("capturedData", JSON.stringify(capturedData));

        const liElem = document.createElement("p");
        liElem.innerText = capturedContent;

        sendResponse({ success: true });
    }
});
