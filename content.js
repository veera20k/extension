async function replaceTextInNodes(root, lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const txtContent = node.nodeValue.trim();
      if (
        /^(?!\s*\/\*)(?=.*[a-zA-Z])/.test(txtContent) && // Ensure there's at least one letter
        txtContent && // Ensure the node is not empty
        node.parentNode.nodeName !== "SCRIPT" && // Skip <script> elements
        node.parentNode.nodeName !== "STYLE" && // Skip <style> elements
        node.parentNode.nodeName !== "NOSCRIPT" // Skip <noscript> elements
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });

  let node;
  let textContent = [];
  const nodesMap = new Map();
  while ((node = walker.nextNode())) {
    const txt = node.nodeValue.trim();
    if (!nodesMap.has(txt)) {
      textContent.push(txt);
      nodesMap.set(txt, [node]);
    } else {
      nodesMap.get(txt).push(node);
    }
  }
  chrome.runtime.sendMessage(
    {
      type: "translateContent",
      content: textContent,
      lang,
    },
    (res) => {
      if (res.translatedText) {
        res.translatedText.forEach((text, index) => {
          nodesMap.get(textContent[index]).forEach((node) => {
            node.nodeValue = text;
          });
        });
      }
    }
  );
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "tranlsateClicked") {
    const selectedLanguage = message.language;
    replaceTextInNodes(document.body, selectedLanguage);
  }
});

// // Set up a MutationObserver to listen for changes in the DOM
// const observer = new MutationObserver((mutationsList) => {
//   for (const mutation of mutationsList) {
//     if (mutation.type === "childList") {
//       // Run replaceTextInNodes on the added nodes
//       mutation.addedNodes.forEach((node) => {
//         if (node.nodeType === Node.ELEMENT_NODE) {
//           replaceTextInNodes(node); // Re-run for the newly added element
//         }
//       });
//     }
//   }
// });

// // Start observing the document body for changes
// observer.observe(document.body, {
//   childList: true, // Look for direct children being added or removed
//   subtree: true, // Look for all descendants
// });
