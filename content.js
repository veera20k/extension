// async function replaceTextInNodes(root = document.body) {
//   const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
//     acceptNode(node) {
//       if (node.nodeValue.trim()) {
//         return NodeFilter.FILTER_ACCEPT;
//       }
//       return NodeFilter.FILTER_SKIP;
//     },
//   });

//   let node;
//   const nodes = [];
//   while ((node = walker.nextNode())) {
//     nodes.push(node);
//   }
//   const textToTranslate = nodes.map((node) => node.nodeValue);
//   try {
//     const res = await fetch("http://localhost:3000/", {
//       body: JSON.stringify(textToTranslate),
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const translatedText = await res.json();
//     console.log(translatedText);
//     for (let i = 0; i < nodes.length; i++) {
//       nodes[i].nodeValue = translatedText[i];
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// replaceTextInNodes();

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
//   subtree: true,   // Look for all descendants
// });
