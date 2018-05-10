browser.runtime.onMessage.addListener(notify)
function notify(message) {
    console.log("GOT DATA", message);
    var blob = new Blob([message], { type: 'text/html' });
    browser.downloads.download({
        url: URL.createObjectURL(blob),
        filename: "slack-save-" + (new Date()) + ".html"
    });
}
