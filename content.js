function findTos() {
    const commonPhrases = [
      "terms of service",
      "terms and conditions",
      "terms",
      "conditions of use",
      "service agreement",
      "user agreement",
      "privacy policy"
    ];
  
    // Check headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
      const text = heading.innerText.toLowerCase();
      for (const phrase of commonPhrases) {
        if (text.includes(phrase)) {
          // Find the nearest parent section, article, or div element
          let parent = heading;
          while (parent && !['section', 'article', 'div'].includes(parent.tagName.toLowerCase())) {
            parent = parent.parentElement;
          }
          if (parent) {
            console.log("Found ToS in heading:", parent.innerText); // Add logging
            return parent.innerText;
          }
        }
      }
    }
  
    // Check for specific links
    const links = document.querySelectorAll('a');
    for (const link of links) {
      const text = link.innerText.toLowerCase();
      for (const phrase of commonPhrases) {
        if (text.includes(phrase)) {
          // Follow the link and get the content of the page
          console.log("Found ToS link:", link.href); // Add logging
          return fetch(link.href)
            .then(response => response.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              console.log("Fetched ToS content:", doc.body.innerText); // Add logging
              return doc.body.innerText;
            })
            .catch(error => {
              console.error("Error fetching link:", error);
              return null;
            });
        }
      }
    }
  
    console.log("Terms of Service not found."); // Add logging
    return null;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkTos") {
      const tosTextPromise = findTos();
      if (tosTextPromise instanceof Promise) {
        tosTextPromise.then(tosText => {
          if (tosText) {
            console.log("Sending ToS to background:", tosText); // Add logging
            chrome.runtime.sendMessage({ action: "sendTos", tos: tosText }, (response) => {
              if (response.score !== undefined) {
                alert(`ToS Score: ${response.score}`);
              } else {
                alert(`Error: ${response.error || "Unexpected API response"}`);
              }
            });
          } else {
            alert("Terms of Service not found.");
          }
        });
      } else if (tosTextPromise) {
        console.log("Sending ToS to background:", tosTextPromise); // Add logging
        chrome.runtime.sendMessage({ action: "sendTos", tos: tosTextPromise }, (response) => {
          if (response.score !== undefined) {
            alert(`ToS Score: ${response.score}`);
          } else {
            alert(`Error: ${response.error || "Unexpected API response"}`);
          }
        });
      } else {
        alert("Terms of Service not found.");
      }
    }
  });