/*
  Word search and translation logic (for now with some things in Portuguese).
*/

document.getElementById("getSoloText").addEventListener("click", () => {
  // Obtém o tabId da aba ativa
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    
    // Verifica se a URL da aba começa com http:// ou https:// (URL válida)
    if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
      const tabId = tab.id;
      
      // Executa o script na aba ativa
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: getNewText
      });
    } else {
      console.log("A extensão não pode ser usada em páginas internas do Chrome.");
    }
  });
});

// Função que será executada na aba ativa
function getNewText() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    // Exibe um alert com a palavra selecionada
    alert("Palavra selecionada: " + selectedText);
  }
}
