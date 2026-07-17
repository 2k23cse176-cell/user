// ==UserScript==
// @name         Discord Auto Continue
// @namespace    https://github.com/2k23cse176-cell/user
// @version      1.0
// @description  Automatically click "Continue in Browser" on Discord web when the app-detected dialog appears.
// @match        https://discord.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function(){
  const textMatch = /continue in browser/i;
  const attrMatch = /continue in browser/i;
  function clickContinue(){
    const candidates = Array.from(document.querySelectorAll('button, a'));
    for(const el of candidates){
      const txt = (el.textContent || '').trim();
      if(textMatch.test(txt)){
        el.click();
        return true;
      }
      const aria = (el.getAttribute('aria-label') || '').trim();
      if(attrMatch.test(aria)){
        el.click();
        return true;
      }
    }
    return false;
  }

  const observer = new MutationObserver(()=>{ if(clickContinue()) observer.disconnect(); });
  if(clickContinue()) return;
  observer.observe(document.documentElement, {childList:true, subtree:true, characterData:true});
  setInterval(()=>{ if(clickContinue()){ observer.disconnect(); } }, 800);
})();
