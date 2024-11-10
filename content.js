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
  const nodes = [];
  while (true) {
    const curr = walker.nextNode();
    if (!curr) {
      break;
    }
    nodes.push(curr);
  }
  translateFromNodes(nodes, lang);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "tranlsateClicked") {
    const selectedLanguage = message.language;
    replaceTextInNodes(document.body, selectedLanguage);
  }
});

function translateFromNodes(nodes, lang) {
  let node;
  let textContent = [];
  const nodesMap = new Map();
  for (node of nodes) {
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

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        console.log(mutation);
      }
    }
  });
  observer.observe(document.body, {
    childList: true, // Look for direct children being added or removed
    subtree: true, // Look for all descendants
  }); 

