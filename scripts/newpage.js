// newpage.js
// Retrieve the content parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const content = urlParams.get("content");

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Display the content in the "content" div
    const contentDiv = document.getElementById("content");
    contentDiv.innerText = content;

    // Add event listener to the back button
    const backButton = document.getElementById("backButton");
    backButton.addEventListener("click", () => {
        history.back();
    });

    // Add event listener to the email button
    const emailButton = document.getElementById("emailButton");
    emailButton.addEventListener("click", () => {
        generateText("Write an email using the following information", content).then((generatedText) => {
            localStorage.setItem(`aigenerated_${content}`, generatedText);
            const fetchedGeneratedText = localStorage.getItem(`aigenerated_${content}`);

            const generatedtextdiv = document.getElementById("generated_text_div");
            generatedtextdiv.innerText = fetchedGeneratedText;
            updateGeneratedTextDivVisibility();
        });
    });

    // Add event listener to the Trump button
    const trumpButton = document.getElementById("trumpButton");
    trumpButton.addEventListener("click", () => {
        generateText("How would Donald Trump say the following", content).then((generatedText) => {
            localStorage.setItem(`aigenerated_${content}`, generatedText);
            const fetchedGeneratedText = localStorage.getItem(`aigenerated_${content}`);

            const generatedtextdiv = document.getElementById("generated_text_div");
            generatedtextdiv.innerText = fetchedGeneratedText;
            updateGeneratedTextDivVisibility();
        });
    });


    // Add event listener to the haiku button
    const haikuButton = document.getElementById("haikuButton");
    haikuButton.addEventListener("click", () => {
        generateText("Write a haiku using the following information", content).then((generatedText) => {
            localStorage.setItem(`aigenerated_${content}`, generatedText);
            const fetchedGeneratedText = localStorage.getItem(`aigenerated_${content}`);

            const generatedtextdiv = document.getElementById("generated_text_div");
            generatedtextdiv.innerText = fetchedGeneratedText;
            updateGeneratedTextDivVisibility();
        });
    });

    // Add event listener to the generated text div
    const generatedTextDiv = document.getElementById("generated_text_div");

    const updateGeneratedTextDivVisibility = () => {
        if (localStorage.getItem(`aigenerated_${content}`)) {
            generatedTextDiv.style.display = "block";
            generatedTextDiv.innerText = localStorage.getItem(`aigenerated_${content}`);
        } else {
            generatedTextDiv.style.display = "none";
        }
    };

    generatedTextDiv.addEventListener("click", () => {
        const generatedText = generatedTextDiv.innerText;
        if (generatedText) {
            navigator.clipboard.writeText(generatedText)
                .then(() => {
                    console.log("Text copied to clipboard");
                })
                .catch((error) => {
                    console.error("Error copying text to clipboard:", error);
                });
        }
    });

    updateGeneratedTextDivVisibility();
    // const observer = new MutationObserver(updateGeneratedTextDivVisibility);
    // observer.observe(generatedTextDiv, { childList: true });

});

// Function to generate text using the OpenAI API
async function generateText(prompt, content) {
    // Prepare the messages for the API call
    const messages = [
        { role: "system", content: "You are ChatGPT, a large language model trained by OpenAI." },
        { role: "user", content: prompt },
        { role: "assistant", content: content },
    ];

    try {
        // Make the API call to generate text
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer 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", // Replace with your OpenAI API key
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            const generatedText = data.choices[0].message.content;
            return generatedText;
        } else {
            throw new Error(`Request failed with status ${response.status}: ${data.error.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle error in your application
    }
}
