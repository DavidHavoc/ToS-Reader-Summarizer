chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).then(() => {
      chrome.tabs.sendMessage(tab.id, { action: "checkTos" });
    });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendTos") {
      fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
        method: "POST",
        headers: {
          "Authorization": "Bearer ",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: request.tos })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("API Response:", data);
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'number') {
          sendResponse({ score: data[0] });
        } else {
          sendResponse({ error: "Unexpected API response format" });
        }
      })
      .catch(error => {
        console.error("Error:", error);
        sendResponse({ error: error.message });
      });
      return true;  // Will respond asynchronously.
    }
  });