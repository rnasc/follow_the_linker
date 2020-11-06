const menuItem = {
  "id": "follow_the_linker",
  "title": "Follow the Linker",
  "contexts": ["all"]
}

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function (clicketData) {
  if (clicketData.menuItemId == "follow_the_linker") {
    chrome.extension.getBackbroundPage.console.log("--> Olha eu aqui")
  }
});

function doStuffWithDOM(domContent) {
  chrome.extension.getBackbroundPage.console.log("--> Olha eu aqui")
  console.log(domContent)
  chrome.extension.getBackbroundPage.console.log(domContent)

}
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, doStuffWithDOM)
})
