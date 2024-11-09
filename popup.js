document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("language");
  const translateButton = document.getElementById("translateButton");
  const selectedLanguage = languageSelect.value;
  translateButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "tranlsateClicked",
        language: selectedLanguage,
      });
    });
  });
});
