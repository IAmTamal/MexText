# What is MexText ? 

MexText is a browser extension which allows you to capture any text element from any website and then you can just have it stored or do some fun stuff with it using chatGPT.

<br/>


<br>



## Tech Stack 💻

<p >
    <img alt="C" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
    <img alt="C" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
    <img alt="C" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</p>


## How to use ? 📖


## Architecture 📐

The MexText Chrome Extension is built using HTML, CSS, and JavaScript. The codebase consists of several files and follows a specific workflow. Here's an overview of the key components and their interactions:

- `manifest.json`: This file serves as the entry point for the extension and contains metadata, permissions, and references to the necessary resources.

- `popup.html` and `popup.js`: The `popup.html` file defines the user interface of the extension's popup window, while `popup.js` contains the JavaScript code responsible for handling user interactions in the popup window. It listens for events such as button clicks and communicates with other parts of the extension.

- `contentScript.js`: The `contentScript.js` file is injected into web pages and runs in the context of the currently active tab. It captures user interactions with the web page, such as hovering over elements and clicking, to extract content from the selected element. It communicates with the `popup.js` script using the Chrome Extension Messaging API.

- `newpage.html` and `newpage.js`: The `newpage.html` file represents a specific web page where the extension provides additional functionalities. The `newpage.js` file contains the JavaScript code that handles the logic and interactions specific to this page. It listens for button clicks and triggers actions based on the user's selection.

## Under the hood 🧐

**The general workflow of the extension can be summarized as follows:**

1. The user installs and launches the extension by clicking on the MexText extension icon in the Chrome toolbar.

2. In the popup window, the user can click on the "Capture Content" button to enable content capturing mode.

3. When the user hovers over an element on a web page, the `contentScript.js` script highlights the element, indicating that it can be selected.

4. Once the user clicks on an element, the `contentScript.js` script captures the content of the selected element and sends it, along with relevant information like the element ID and URL, to the `popup.js` script using the Chrome Extension Messaging API.

5. The `popup.js` script receives the captured content and updates the UI in the popup window, displaying the captured data.

6. The user can manage the captured data by clicking on the "Clear" button to remove all captured content or selecting the "Show Current Site" or "Show All" buttons to filter and display the captured content for the current site or all sites, respectively.

7. On the `newpage.html` page, the user can perform additional actions, such as generating text in a specific style, writing an email, or creating a haiku, by clicking on the corresponding buttons. The `newpage.js` script handles the logic for these actions and generates the desired text.
