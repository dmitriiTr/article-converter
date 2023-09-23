const downloadElement = document.getElementById('download');

downloadElement?.addEventListener('click', async () => {
	const selectors: HTMLInputElement | null = document.querySelector('#selectors');
	chrome.storage.sync.set({ selectors: selectors?.value });
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const tabId = tab?.id;

	if (tabId) {
		chrome.scripting.executeScript({
			target: { tabId },
			func: downloadArticle,
		});
	}
});

const downloadArticle = () => chrome.storage.sync.get('selectors').then(({ selectors: selectors }) => {
	(selectors as string).split(' ').forEach(selector =>
		document.querySelectorAll(selector).forEach(element => element.remove()));

	chrome.runtime.sendMessage(document.documentElement.outerHTML);
});

chrome.runtime.onMessage.addListener(documentAsHtml =>
	chrome.downloads.download({ url: URL.createObjectURL(new Blob([documentAsHtml], { type: 'text/html' })) })
);