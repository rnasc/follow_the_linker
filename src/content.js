//chrome.runtime.sendMessage({ todo: "showPageAction" });
var links = {}
async function returnURLContent(url) {
  return Promise.resolve($.ajax({
    url: url
  }));
}

function downloadCompatibleBrowser() {
  return JSZip.support.blob
}

function zipAndDownload(linkArr) {
  let count = 0;

  console.log("To zipando")
  if (!downloadCompatibleBrowser()) {
    alert('This browser doesnt allow downloading from here. Please try Chrome')
    return;
  }

  const saveAs = window.saveAs || (navigator.msSaveBlob && navigator.msSaveBlob.bind(navigator))
  const zip = new JSZip();
  linkArr.map((data) => {
    console.log(data)
    count += 1;
    zip.file(`file_${count}.html`, data.link)
  })

  console.log("ja zipei")
  console.log(zip)

  try {
    zip
      .generateAsync({ type: "blob" })
      .then(function (blob) {
        if (saveAs) {
          saveAs(blob, "content.zip");
        } else {
          const a = document.createElement('a');
          a.download = 'content.zip'
          a.href = window.URL.createObjectURL(blob)
          a.click();
        }
      })
  } catch (error) {
    console.log("-> Error during zip file creation or download")
    console.log(error)
  }
}

function processDOM() {
  links = {}
  $('a').each(function () {
    if (this.href.includes('/backoffice/listing/edit')) {
      links[this.href] = null;
    }
  })
  a_links = [];
  result_links = []

  // By using a hash, duplicated urls 
  // will be removed
  for (var key in links) {
    a_links.push({ key: key, link: null })
  }

  a_links = a_links.map(async (hash) => {
    try {
      hash.link = await returnURLContent(hash.key);
      result_links.push(hash)
      console.log(hash)
    } catch (err) {
      console.log('=> Erro')
      console.log(err)
    }
  });

  setTimeout(() => {
    zipAndDownload(result_links);
    return result_links;
  }, 7000);
}



$(document).ready(function () {
  $("#btn_download").click(function () {
    const executing = chrome.tabs.executeScript({
      code: `( ${processDOM})();`
    }, function (results) {
      console.log('Pop up script:')
      console.log(results)
    });
  })
});

chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.text && (request.text == "getDOM")) {
      sendResponse({ dom: document.body.innerHTML });
    }
  }
)
