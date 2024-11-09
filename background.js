chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "translateContent") {
    const lang = message.lang;
    const content = message.content;

    console.log('content got');
    
    translateText(content, lang)
      .then((translatedText) => {
        sendResponse({ translatedText });
      })
      .catch((error) => {
        sendResponse({ translatedText: [] });
      });
    return true;
  }
});

async function translateText(textContent, lang) {
  try {
    const res = await fetch("http://localhost:3000/", {
      body: JSON.stringify({ text: textContent, lang: 'hi' }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    throw error;
  }
}
