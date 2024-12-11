/*
 * Word search and translation logic (for now with some things in Portuguese).
 */

// Checks if the button exists on the page
const getSoloTextButton = document.getElementById("getSoloText");
if (getSoloTextButton != null) {
  console.log("Button found.");

  getSoloTextButton.addEventListener("click", () => {
    // Displays the loading indicator
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.display = "block";
    }

    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.style.display = "none"; // Hides the previous result
    }

    // Gets the tabId of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      console.log("Active tab:", tab);

      // Checks if the URL of the tab starts with http:// or https:// (valid URL)
      if (
        tab.url &&
        (tab.url.startsWith("http://") || tab.url.startsWith("https://"))
      ) {
        const tabId = tab.id;
        console.log("Tab ID:", tabId);

        // Executes the script on the active tab
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: getNewText,
        });
      } else {
        console.log(
          "The extension cannot be used on Chrome internal pages."
        );
      }
    });
  });
} else {
  console.log("Button not found.");
}

// Function that will be executed on the active tab
function getNewText() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  console.log("Selected text:", selectedText);

  if (selectedText) {
    const data = {
      origin_lang: "en_XX", // Source language
      dest_lang: "pt_XX", // Destination language
      origin_text: selectedText, // Selected text
    };

    fetch("http://LINK/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "cors",
      credentials: "omit",
    })
      .then((response) => {
        console.log("API response:", response);
        if (!response.ok) {
          throw new Error(`API Error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("Translation result:", result);

        // Updates the HTML with the result
        const loadingElement = document.getElementById("loading");
        if (loadingElement) {
          loadingElement.style.display = "none"; // Hides the loading
        }

        const resultElement = document.getElementById("result");
        if (resultElement) {
          resultElement.style.display = "block"; // Shows the result
          const translatedTextElement =
            document.getElementById("translatedText");
          if (translatedTextElement) {
            translatedTextElement.textContent = result.translation;
          }
        }
      })
      .catch((error) => {
        console.error("Request error:", error);

        // Checks if the element exists before changing the style
        const loadingElement = document.getElementById("loading");
        if (loadingElement) {
          loadingElement.style.display = "none"; // Hides the loading
        }

        alert("There was an error trying to translate the text.");
      });
  } else {
    console.log("No text selected.");
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
      loadingElement.style.display = "none"; // Hides the loading
    }
    alert("Please select some text on the page.");
  }
}
