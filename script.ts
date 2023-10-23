type ArticleData = {
  content: string;
  title: string;
}

type FiltersForUrl = {
  commonSelectors: string;
  filters: [{
    url: string,
    selectors: string
  }];
}

const xhr = new XMLHttpRequest();
xhr.onload = async () => {
  if (xhr.status === 200) {
    const response = xhr.response as string;
    const filters = JSON.parse(response) as FiltersForUrl;

    const input = document.querySelector<HTMLInputElement>('#selectors');
    if (input) {

      const [tab] = await chrome.tabs.query(
        { active: true, currentWindow: true });
      const tabId = tab?.id;

      if (tabId) {
        const url = tab.url || '';
        const selectors = filters.filters
          .filter(f => url.includes(f.url))[0]?.selectors;

        input.value =
          `${filters.commonSelectors}${selectors ? ' ' + selectors : ''}`;
      }
    }

  }
};
xhr.open('GET', chrome.runtime.getURL('./filters.json'), true);
xhr.send();

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
    filename: 'article' + '.html',
    saveAs: true
  })
);