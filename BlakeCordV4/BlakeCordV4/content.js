(function () {
  if (window.__BLAKECORD_LOADED__) return;
  window.__BLAKECORD_LOADED__ = true;
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('injector.js');
  s.onload = () => s.remove();
  document.documentElement.appendChild(s);
})();
