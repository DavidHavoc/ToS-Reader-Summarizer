document.getElementById('checkTos').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }).then(() => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "checkTos" });
      });
    });
  });