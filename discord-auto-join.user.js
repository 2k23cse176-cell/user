// ==UserScript==
// @name         Discord Auto Joiner
// @namespace    https://github.com/2k23cse176-cell/user
// @version      1.3
// @description  Opens Discord invite links and clicks common join/consent prompts, plus visible verification widgets automatically.
// @match        https://discord.com/*
// @match        https://discord.gg/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const clickableSelector = 'button, a, [role="button"], input[type="button"], input[type="submit"]';
  const intervalMs = 800;
  const maxAttempts = 220;
  const invitePattern = /discord\.(gg|com)\/(invite|join|guild-invite|server|channels)\//i;

  function getText(el) {
    return (el.textContent || el.value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const style = window.getComputedStyle(el);
    if (!style) return false;
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function clickMatch(el, patterns) {
    if (!el || !isVisible(el)) return false;
    const text = getText(el);
    const aria = (el.getAttribute('aria-label') || '').trim().toLowerCase();
    const full = `${text} ${aria}`;

    for (const pattern of patterns) {
      if (pattern.test(text) || pattern.test(aria) || pattern.test(full)) {
        el.click();
        return true;
      }
    }
    return false;
  }

  function tryCaptchaAutoSolve() {
    const pageText = (document.body?.textContent || '').toLowerCase();
    const hasCaptchaKeywords = /captcha|verify you are human|verify your account|robot|human verification|recaptcha|hcaptcha/i.test(pageText);
    const hasCaptchaFrame = Array.from(document.querySelectorAll('iframe, frame')).some((frame) => {
      const src = (frame.getAttribute('src') || '').toLowerCase();
      return src.includes('recaptcha') || src.includes('hcaptcha') || src.includes('captcha');
    });

    if (!hasCaptchaKeywords && !hasCaptchaFrame) return false;

    const captchaTargets = Array.from(document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"], input[type="checkbox"], [role="checkbox"]'));
    for (const el of captchaTargets) {
      if (!isVisible(el)) continue;
      const text = getText(el);
      const aria = (el.getAttribute('aria-label') || '').trim().toLowerCase();
      if (/captcha|verify|i am not a robot|not a robot|human|check|continue|next|submit/i.test(text + ' ' + aria)) {
        el.click();
        return true;
      }
      if (el.matches('input[type="checkbox"], [role="checkbox"]')) {
        el.click();
        return true;
      }
    }

    const frames = Array.from(document.querySelectorAll('iframe, frame'));
    for (const frame of frames) {
      if (!isVisible(frame)) continue;
      const src = (frame.getAttribute('src') || '').toLowerCase();
      if (src.includes('recaptcha') || src.includes('hcaptcha') || src.includes('captcha')) {
        frame.click();
        frame.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        frame.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        frame.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return true;
      }
    }

    return false;
  }

  function clickBestAction() {
    if (tryCaptchaAutoSolve()) return true;

    const elements = Array.from(document.querySelectorAll(clickableSelector));

    for (const el of elements) {
      if (!isVisible(el)) continue;

      if (clickMatch(el, [/join server/i, /accept invite/i, /join/i])) return true;
      if (clickMatch(el, [/i agree/i, /agree/i, /accept terms/i, /continue/i, /next/i])) return true;
      if (clickMatch(el, [/i am at least 13/i, /i am over 13/i, /i am 13/i, /yes/i])) return true;

      if (el.matches('input[type="checkbox"]')) {
        el.checked = true;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }

    return false;
  }

  function shouldRun() {
    const url = window.location.href;
    return invitePattern.test(url) || /join server|accept invite|captcha|verify|robot|human/i.test(document.body?.textContent || '');
  }

  if (!shouldRun()) return;

  let attempts = 0;
  const observer = new MutationObserver(() => {
    attempts += 1;
    if (clickBestAction()) {
      observer.disconnect();
    }
  });

  if (clickBestAction()) return;

  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  const intervalId = window.setInterval(() => {
    attempts += 1;
    if (clickBestAction()) {
      window.clearInterval(intervalId);
      observer.disconnect();
    }

    if (attempts >= maxAttempts) {
      window.clearInterval(intervalId);
      observer.disconnect();
    }
  }, intervalMs);
})();
