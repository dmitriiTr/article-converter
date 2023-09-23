type ArticleData = {
  content: string;
  title: string;
}

const downloadElement = document.getElementById('download');

downloadElement?.addEventListener('click', async () => {
  const selectors = document.querySelector<HTMLInputElement>('#selectors');
  chrome.storage.sync.set({ selectors: selectors?.value || '' });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab?.id;

  if (tabId) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: downloadArticle,
    });
  }
});

const downloadArticle = () =>
  chrome.storage.sync.get('selectors').then(({ selectors }) => {
    const selectorsList = (selectors as string).split(' ');

    selectorsList.forEach(selector =>
      document.querySelectorAll(selector).forEach(element => element.remove()));

    chrome.runtime.sendMessage<ArticleData>(
      { content: document.documentElement.outerHTML, title: document.title }
    );
  });

chrome.runtime.onMessage.addListener((articleData: ArticleData) =>
  chrome.downloads.download({
    url: URL.createObjectURL(
      new Blob([articleData.content], { type: 'text/html' })
    ),
    filename: articleData.title + '.html',
    saveAs: true
  })
);