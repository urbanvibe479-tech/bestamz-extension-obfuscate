(()=>{try{
  try {
    if (location.hostname === 'bestamztools.com' && location.pathname.startsWith('/user/member')) {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["member"]) {
        window.__bamzMasterRan["member"] = true;
        
        window.addEventListener("message",(e=>{e.source===window&&e.data.type&&"APPLICATION/CLOSE"===e.data.type&&(chrome.runtime.sendMessage({closeThis:!0}))}),!1),chrome.runtime.sendMessage({action:"CheckCompanionExtension"},(function(e){1==e.install&&function(e){var t=document.querySelectorAll(e);let n=0;for(let s=0;s<t.length;s++){var o=t[s];if(!o.innerText.toLowerCase().includes("keepa pro +")){let t=(o=document.querySelectorAll(e)[s]).outerHTML.split("onclic");o.outerHTML=t[0]+t[1],(o=document.querySelectorAll(e)[s]).i=n,o.onclick=e=>{e=(e=e||window.event).target||e.srcElement;try{let o=e.i,s=document.querySelectorAll(".ext01JSONdiv")[o];var t=s.innerText,n=s.getAttribute("href");if(n.includes("scanunlimited")){let e=s.getAttribute("id"),t=s.getAttribute("pass");chrome.storage.local.set({scanunlimitedClose:!1}),chrome.storage.local.set({scanunlimitedID:e,scanunlimitedPass:t,scanunlimitedURL:n})}else if(n.includes("members.junglescout.com")){let e=s.getAttribute("id"),t=s.getAttribute("pass");chrome.storage.local.set({junglescoutClose:!1}),chrome.storage.local.set({junglescoutID:e,junglescoutPass:t,junglescoutURL:n})}if(window.__bamzImportBusy){try{alert("Please wait. A session switch is already in progress.")}catch(e){}return}window.__bamzImportBusy=!0;var __bamzBusyTimer=setTimeout((()=>{try{window.__bamzImportBusy=!1}catch(e){}}),3e4);try{chrome.runtime.sendMessage({payload:t,action:"decrypt",href:n},(function(r){clearTimeout(__bamzBusyTimer),window.__bamzImportBusy=!1;try{if(chrome.runtime.lastError)throw new Error(chrome.runtime.lastError.message||"Extension error");if(!r||!0!==r.ok)throw new Error(r&&r.error?r.error:"Session switch failed.")}catch(e){try{alert(e&&e.message?e.message:String(e))}catch(_){}}}))}catch(r){clearTimeout(__bamzBusyTimer),window.__bamzImportBusy=!1;throw r}}catch(e){}},n++}}}(".amzToolsExtensionBtn")}));
      }
    }
  } catch (e) {}
  try {
    if ((location.hostname === 'bestamztools.com' && location.pathname.startsWith('/user/member')) || (location.hostname === 'members.helium10.com' && location.pathname === '/' && location.search.includes('accountId=')) || (location.hostname === 'app.scanunlimited.com' && location.pathname === '/session/signin') || (location.hostname === 'login.junglescout.com')) {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["imgproxy"]) {
        window.__bamzMasterRan["imgproxy"] = true;
        (function(){try{if(document.getElementById('__bamz_imgproxy_css'))return;var s=document.createElement('style');s.id='__bamz_imgproxy_css';s.textContent=".tbx-img-anim {\n  cursor: pointer !important;\n  transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;\n  outline: none;\n}\n.tbx-img-anim:hover {\n  transform: translateY(-2px) scale(1.02);\n  filter: brightness(1.03);\n}\n.tbx-img-anim:active,\n.tbx-pressed {\n  transform: scale(0.98) !important;\n}";document.documentElement.appendChild(s);}catch(e){}})();
        (() => {
  const BUTTON_SEL = '.amzToolsExtensionBtn, .amzToolsExtensionBtnweb';
  const IMAGE_SEL  = 'img, .tool-img, .card img, .tile img';
  const CLICK_LOCK_MS = 1500;
  const setLock = (root) => {
    try {
      const scope = root || document;
      if (scope.__tbxClickLock) return false;
      scope.__tbxClickLock = true;
      setTimeout(() => { try { scope.__tbxClickLock = false; } catch(e){} }, CLICK_LOCK_MS);
      return true;
    } catch (e) { return true; }
  };
  const findNearestButton = (el) => {
    let node = el;
    for (let i = 0; i < 6 && node; i++, node = node.parentElement) {
      let btn = node.querySelector?.(BUTTON_SEL);
      if (btn) return btn;
      if (node.parentElement) {
        btn = [...node.parentElement.querySelectorAll(BUTTON_SEL)]
          .find(b => b !== el && (b.offsetParent !== null));
        if (btn) return btn;
      }
    }
    return null;
  };
  const isLikelyToolImage = (el) => {
    if (!(el instanceof Element)) return false;
    const badHints = ['logo', 'footer', 'header', 'avatar', 'icon'];
    const cls = (el.className || '').toString().toLowerCase();
    const alt = (el.getAttribute('alt') || '').toLowerCase();
    const src = (el.getAttribute('src') || '').toLowerCase();
    if (badHints.some(h => cls.includes(h) || alt.includes(h) || src.includes(h))) return false;
    return !!findNearestButton(el);
  };
  const proxyClick = (ev) => {
    const target = ev.target.closest(IMAGE_SEL);
    if (!target || !isLikelyToolImage(target)) return;
    const btn = findNearestButton(target);
    if (!btn) return;
    if (!setLock(document)) { ev.preventDefault(); ev.stopPropagation(); return; }
    ev.preventDefault(); ev.stopPropagation();
    try { target.classList.add('tbx-pressed'); setTimeout(() => target.classList.remove('tbx-pressed'), 160); } catch(e){}
    try { btn.click(); } catch(e){}
  };
  document.addEventListener('click', proxyClick, true);
  document.addEventListener('keydown', (ev) => {
    const tag = (ev.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || ev.target.isContentEditable) return;
    if (ev.key === 'Enter' || ev.key === ' ') {
      const img = ev.target.closest(IMAGE_SEL);
      if (!img) return;
      proxyClick({ target: img, preventDefault:()=>{}, stopPropagation:()=>{} });
    }
  }, true);
  const mo = new MutationObserver((muts) => {
    muts.forEach(m => {
      m.addedNodes?.forEach(n => {
        if (!(n instanceof Element)) return;
        const buttons = n.querySelectorAll?.(BUTTON_SEL) || [];
        buttons.forEach((b) => {
          const container = b.closest('.card, .tile, .panel, .box, .wrap') || b.parentElement;
          if (!container) return;
          container.querySelectorAll(IMAGE_SEL).forEach(img => {
            if (isLikelyToolImage(img)) img.classList.add('tbx-img-anim');
          });
        });
      });
    });
  });
  try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch(e){}
  try {
    document.querySelectorAll(IMAGE_SEL).forEach(img => {
      if (isLikelyToolImage(img)) img.classList.add('tbx-img-anim');
    });
  } catch(e){}
})();
      }
    }
  } catch (e) {}
  try {
    if (location.hostname === 'members.helium10.com' && location.pathname === '/' && location.search.includes('accountId=')) {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["h10tweak"]) {
        window.__bamzMasterRan["h10tweak"] = true;
        
        try{var __el=document.querySelector('.dashboard-welcome-title');if(__el&&__el.remove)__el.remove();}catch(e){}
      }
    }
  } catch (e) {}
  try {
    if (location.hostname === 'members.helium10.com') {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["h10hide"]) {
        window.__bamzMasterRan["h10hide"] = true;
        
        (() => {

  const TEXTS = new Set(["log out", "logout", "sign out", "signout"]);
  const CLICKABLE_SEL =
    'a, button, [role="button"], [role="menuitem"], input[type="button"], input[type="submit"]';

  const norm = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();

  function shouldHideText(t) {
    const n = norm(t);
    if (!n) return false;

    if (TEXTS.has(n)) return true;

    if (n.includes("log out all") || n.includes("logout all") || n.includes("all sessions")) {
      if (n.includes("log out") || n.includes("logout")) return true;
    }

    if (n.startsWith("log out") || n.startsWith("logout") || n.startsWith("sign out") || n.startsWith("signout")) {
      return true;
    }

    if (n.includes("log out") || n.includes("logout") || n.includes("sign out") || n.includes("signout")) {
      return n.length <= 32;
    }

    return false;
  }

  function hideNode(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.getAttribute && node.getAttribute("data-bestamz-hidden-logout") === "1") return;

    const el = /** @type {HTMLElement} */ (node);
    const container = el.closest(CLICKABLE_SEL) || el;

    if (container && container.style) {
      container.style.setProperty("display", "none", "important");
      container.setAttribute("data-bestamz-hidden-logout", "1");
    }
  }

  function hideLogoutEverywhere(root = document) {
    const candidates = root.querySelectorAll(CLICKABLE_SEL);

    for (const el of candidates) {
      if (el.getAttribute && el.getAttribute("data-bestamz-hidden-logout") === "1") continue;

      const hEl = /** @type {HTMLElement} */ (el);
      const txt = ("value" in el && typeof el.value === "string" && el.value) ? el.value : hEl.innerText;

      if (shouldHideText(txt)) {
        hideNode(el);
        continue;
      }

      const href = (el.getAttribute && el.getAttribute("href")) || "";
      const aria = (el.getAttribute && (el.getAttribute("aria-label") || el.getAttribute("title"))) || "";
      const dataTest = (el.getAttribute && (el.getAttribute("data-testid") || el.getAttribute("data-test"))) || "";
      const hay = norm([href, aria, dataTest].join(" "));

      if (hay.includes("logout") || hay.includes("log out") || hay.includes("signout") || hay.includes("sign out")) {
        hideNode(el);
        continue;
      }
    }

    const nested = root.querySelectorAll(`${CLICKABLE_SEL} span, ${CLICKABLE_SEL} div`);
    for (const el of nested) {
      if (el.getAttribute && el.getAttribute("data-bestamz-hidden-logout") === "1") continue;
      if (shouldHideText(el.textContent)) hideNode(el);
    }
  }

  hideLogoutEverywhere(document);

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      hideLogoutEverywhere(document);
    });
  };

  const obs = new MutationObserver(schedule);
  obs.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });

  const origPush = history.pushState;
  const origReplace = history.replaceState;

  history.pushState = function (...args) {
    const r = origPush.apply(this, args);
    schedule();
    return r;
  };
  history.replaceState = function (...args) {
    const r = origReplace.apply(this, args);
    schedule();
    return r;
  };
  window.addEventListener("popstate", schedule);

  setInterval(() => hideLogoutEverywhere(document), 2000);
})();

      }
    }
  } catch (e) {}
  try {
    if (location.hostname === 'app.scanunlimited.com' && location.pathname === '/session/signin') {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["scanunlimited"]) {
        window.__bamzMasterRan["scanunlimited"] = true;
        (function(){try{if(!document.arrive){var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=s.bindEvent,r(s,e,"unbindArrive"),e.leave=u.bindEvent,r(u,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding((function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver((function(e){r.call(this,e,n)}));var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o})),i.beforeRemoving((function(e){e.observer.disconnect()})),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent((function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1}))},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent((function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1}))},this},s=new function(){function e(e,t){return!(!l.matchesSelector(e,t.selector)||(e._id===n&&(e._id=o++),-1!=t.firedElems.indexOf(e._id)))&&(t.firedElems.push(e._id),!0)}var t={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};s=new a((function(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}),(function(t,n){t.forEach((function(t){var r=t.addedNodes,i=t.target,o=[];null!==r&&r.length>0?l.checkChildNodesRecursively(r,n,e,o):"attributes"===t.type&&e(i,n)&&o.push({callback:n.callback,elem:i}),l.callCallbacks(o,n)}))}));var r=s.bindEvent;return s.bindEvent=function(e,i,o){n===o?(o=i,i=t):i=l.mergeArrays(t,i);var c=l.toElementsArray(this);if(i.existing){for(var a=[],s=0;s<c.length;s++)for(var u=c[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:o,elem:u[f]});if(i.onceOnly&&a.length)return o.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}r.call(this,e,i,o)},s},u=new function(){function e(e,t){return l.matchesSelector(e,t.selector)}var t={};u=new a((function(){return{childList:!0,subtree:!0}}),(function(t,n){t.forEach((function(t){var r=t.removedNodes,i=[];null!==r&&r.length>0&&l.checkChildNodesRecursively(r,n,e,i),l.callCallbacks(i,n)}))}));var r=u.bindEvent;return u.bindEvent=function(e,i,o){n===o?(o=i,i=t):i=l.mergeArrays(t,i),r.call(this,e,i,o)},u};t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var f={};return r(s,f,"unbindAllArrive"),r(u,f,"unbindAllLeave"),f}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);}}catch(e){}})();
        (()=>{try{chrome.storage.local.get(["scanunlimitedID","scanunlimitedPass","scanunlimitedURL"],(function(data){try{if(!data||!data.scanunlimitedID)return;const evt=new Event("input",{bubbles:!0}),selector="[type='email']",run=()=>{try{const email=document.querySelector("[type='email']"),pass=document.querySelector("[type='password']");if(!email||!pass)return;email.value=data.scanunlimitedID||"",email.dispatchEvent(evt),pass.value=data.scanunlimitedPass||"",pass.dispatchEvent(evt),chrome.storage.local.set({scanunlimitedClose:!0}),setTimeout((()=>{try{const btn=document.querySelector('[class=\"ng-star-inserted\"]')||document.querySelector('button[type=\"submit\"]')||document.querySelector("button");btn&&btn.click()}catch(_){}}),20);let watcher=setInterval((()=>{try{const field=document.querySelector("[placeholder='Password']");if(!field){clearInterval(watcher);return}if(field.type!=="password"){field.value="",field.dispatchEvent(evt),clearInterval(watcher)}}catch(_){clearInterval(watcher)}}),100)}catch(_){}};if(document.querySelector(selector))run();else if(document.arrive)document.arrive(selector,(function(){run()}))}catch(_){}}))}catch(_){}})();
      }
    }
  } catch (e) {}
  try {
    if (location.hostname === 'login.junglescout.com') {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["junglescoutlogin"]) {
        window.__bamzMasterRan["junglescoutlogin"] = true;
        (function(){try{if(!document.arrive){var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=s.bindEvent,r(s,e,"unbindArrive"),e.leave=u.bindEvent,r(u,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding((function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver((function(e){r.call(this,e,n)}));var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o})),i.beforeRemoving((function(e){e.observer.disconnect()})),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent((function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1}))},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent((function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1}))},this},s=new function(){function e(e,t){return!(!l.matchesSelector(e,t.selector)||(e._id===n&&(e._id=o++),-1!=t.firedElems.indexOf(e._id)))&&(t.firedElems.push(e._id),!0)}var t={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};s=new a((function(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}),(function(t,n){t.forEach((function(t){var r=t.addedNodes,i=t.target,o=[];null!==r&&r.length>0?l.checkChildNodesRecursively(r,n,e,o):"attributes"===t.type&&e(i,n)&&o.push({callback:n.callback,elem:i}),l.callCallbacks(o,n)}))}));var r=s.bindEvent;return s.bindEvent=function(e,i,o){n===o?(o=i,i=t):i=l.mergeArrays(t,i);var c=l.toElementsArray(this);if(i.existing){for(var a=[],s=0;s<c.length;s++)for(var u=c[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:o,elem:u[f]});if(i.onceOnly&&a.length)return o.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}r.call(this,e,i,o)},s},u=new function(){function e(e,t){return l.matchesSelector(e,t.selector)}var t={};u=new a((function(){return{childList:!0,subtree:!0}}),(function(t,n){t.forEach((function(t){var r=t.removedNodes,i=[];null!==r&&r.length>0&&l.checkChildNodesRecursively(r,n,e,i),l.callCallbacks(i,n)}))}));var r=u.bindEvent;return u.bindEvent=function(e,i,o){n===o?(o=i,i=t):i=l.mergeArrays(t,i),r.call(this,e,i,o)},u};t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var f={};return r(s,f,"unbindAllArrive"),r(u,f,"unbindAllLeave"),f}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);}}catch(e){}})();
        (()=>{try{chrome.storage.local.get(["junglescoutID","junglescoutPass","junglescoutURL"],(function(data){try{if(!data||!data.junglescoutID)return;const evt=new Event("input",{bubbles:!0}),selector="[type='email']",run=()=>{try{const email=document.querySelector("[type='email']"),pass=document.querySelector("[type='password']");if(!email||!pass)return;email.value=data.junglescoutID||"",email.dispatchEvent(evt),pass.value=data.junglescoutPass||"",pass.dispatchEvent(evt),chrome.storage.local.set({junglescoutClose:!0}),setTimeout((()=>{try{const btn=document.querySelector('button[type=\"submit\"]')||document.querySelector("button");btn&&btn.click()}catch(_){}}),20)}catch(_){}};if(document.querySelector(selector))run();else if(document.arrive)document.arrive(selector,(function(){run()}))}catch(_){}}))}catch(_){}})();
      }
    }
  } catch (e) {}
  try {
    if (location.hostname === 'members.junglescout.com') {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["junglescoutmembers"]) {
        window.__bamzMasterRan["junglescoutmembers"] = true;
        
        (() => {
  try {
    if (location.hostname !== 'members.junglescout.com') return;

    const KEY_PHRASES = [
      'log out',
      'logout',
      'sign out',
      'all settings',
      'subscriptions',
      'billing information',
      'billing',
      'amazon settings',
      'contact support'
    ];

    const HIDDEN_MARK = 'data-bamz-hidden';
    const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();

    const hideEl = (el) => {
      if (!el || el.nodeType !== 1) return;
      if (el.getAttribute(HIDDEN_MARK) === '1') return;
      el.setAttribute(HIDDEN_MARK, '1');
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
    };

    const findPopupContainer = (el) => {
      if (!el) return null;
      return el.closest(
        '[role="menu"], [role="dialog"], [role="listbox"], ' +
        '[aria-label*="menu" i], [aria-label*="account" i], ' +
        '[class*="dropdown" i], [class*="menu" i], [class*="popover" i], [class*="popper" i], ' +
        '[data-floating-ui-portal], [data-popper-placement]'
      );
    };

    const hideLinkedTrigger = (popup) => {
      if (!popup || popup.nodeType !== 1) return;

      const labelledby = popup.getAttribute('aria-labelledby');
      if (labelledby) {
        const trig = document.getElementById(labelledby);
        if (trig) hideEl(trig);
      }

      const popupId = popup.id;
      if (popupId) {
        const esc = (window.CSS && CSS.escape) ? CSS.escape(popupId) : popupId.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
        const trig = document.querySelector(`[aria-controls="${esc}"], [aria-owns="${esc}"]`);
        if (trig) hideEl(trig);
      }
    };

    const popupLooksLikeProfileMenu = (popup) => {
      const txt = norm(popup.textContent);
      if (!txt) return false;
      return (
        txt.includes('log out') ||
        txt.includes('logout') ||
        txt.includes('subscriptions') ||
        txt.includes('billing information') ||
        txt.includes('all settings')
      );
    };

    const scanAndHide = () => {
      const popups = document.querySelectorAll(
        '[role="menu"], [role="dialog"], [role="listbox"], ' +
        '[class*="dropdown" i], [class*="menu" i], [class*="popover" i], [class*="popper" i], ' +
        '[data-floating-ui-portal], [data-popper-placement]'
      );

      for (const popup of popups) {
        if (!popupLooksLikeProfileMenu(popup)) continue;
        hideEl(popup);
        hideLinkedTrigger(popup);
      }

      const candidates = document.querySelectorAll('a, button, [role="menuitem"], [role="button"], li');
      for (const el of candidates) {
        const t = norm(el.textContent);
        if (!t) continue;

        const hit = KEY_PHRASES.some((k) => t === k || t.includes(k));
        if (!hit) continue;

        const popup = findPopupContainer(el);
        if (!popup) continue; // Do NOT hide items that are part of normal pages.
        if (!popupLooksLikeProfileMenu(popup)) continue;

        hideEl(popup);
        hideLinkedTrigger(popup);
      }
    };

    scanAndHide();

    const mo = new MutationObserver(() => scanAndHide());
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    setInterval(scanAndHide, 1500);
  } catch (e) {
  }
})();

      }
    }
  } catch (e) {}
  try {
    if (location.hostname === 'chatgpt.com') {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["chatgpt"]) {
        window.__bamzMasterRan["chatgpt"] = true;
        
        (() => {
  try {
    if (location.hostname !== "chatgpt.com") return;

    const HIDDEN_MARK = "data-bamz-hidden";
    const normalize = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();

    const STRONG_KEYS = ["add an account", "upgrade plan", "log out", "logout", "sign out"];
    const ITEM_KEYS = ["settings", "personalization", ...STRONG_KEYS];

    const hasAny = (text, keys) => {
      const t = normalize(text);
      if (!t) return false;
      return keys.some((k) => t.includes(k));
    };

    function hardHide(el) {
      if (!el || el.nodeType !== 1) return;
      if (el.hasAttribute(HIDDEN_MARK)) return;
      el.setAttribute(HIDDEN_MARK, "1");
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
    }

    function isLikelyPlusMenu(text) {
      const t = normalize(text);
      return (
        t.includes("add photos") ||
        t.includes("create image") ||
        t.includes("deep research") ||
        t.includes("shopping research") ||
        t.includes("web search")
      );
    }

    function hideAccountMenuPopovers() {
      const candidates = document.querySelectorAll(
        '[role="menu"], [role="dialog"], [data-radix-popper-content-wrapper]'
      );

      for (const c of candidates) {
        if (!c || c.hasAttribute(HIDDEN_MARK)) continue;

        const t = normalize(c.innerText || c.textContent);

        if (isLikelyPlusMenu(t)) continue;

        if (!hasAny(t, STRONG_KEYS)) continue;

        hardHide(c);
        const wrap = c.closest('[data-radix-popper-content-wrapper]');
        if (wrap) hardHide(wrap);
      }
    }

    function hideAccountMenuItemsByText() {
      const items = document.querySelectorAll('a, button, [role="menuitem"], li');
      for (const it of items) {
        if (!it || it.hasAttribute(HIDDEN_MARK)) continue;
        const txt = normalize(it.innerText || it.textContent);
        if (!txt) continue;

        if (isLikelyPlusMenu(txt)) continue;

        if (!hasAny(txt, ITEM_KEYS)) continue;

        const inMenu = it.closest('[role="menu"], [role="dialog"], [data-radix-popper-content-wrapper]');
        if (!inMenu) continue;

        const menuText = normalize(inMenu.innerText || inMenu.textContent);
        if (!hasAny(menuText, STRONG_KEYS)) continue;

        hardHide(it.closest('a, button, [role="menuitem"], li') || it);
      }
    }

    function hideProfileEntryPoints() {
      const scopes = document.querySelectorAll('nav, aside, header');
      for (const scope of scopes) {
        const btns = scope.querySelectorAll('button, [role="button"], a');
        for (const b of btns) {
          if (!b || b.hasAttribute(HIDDEN_MARK)) continue;

          const al = normalize(b.getAttribute('aria-label'));
          const dt = normalize(b.getAttribute('data-testid'));

          const looksLikeAccount =
            al.includes("account") ||
            al.includes("profile") ||
            al.includes("user menu") ||
            al.includes("user") ||
            dt.includes("account") ||
            dt.includes("profile") ||
            dt.includes("user");

          if (!looksLikeAccount) continue;

          const title = normalize(b.getAttribute('title'));
          if (title.includes("attach") || title.includes("add") || title.includes("new")) continue;

          hardHide(b);
        }
      }
    }

    function tick() {
      hideAccountMenuPopovers();
      hideAccountMenuItemsByText();
      hideProfileEntryPoints();
    }

    tick();

    let raf = 0;
    const mo = new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    });
    mo.observe(document.documentElement, { subtree: true, childList: true });

    setInterval(tick, 1200);
  } catch (e) {
  }
})();
      }
    }
  } catch (e) {}
  try {
    if ((location.hostname==='canva.com'||location.hostname==='www.canva.com')) {
      if (!window.__bamzMasterRan) window.__bamzMasterRan = Object.create(null);
      if (!window.__bamzMasterRan["canva"]) {
        window.__bamzMasterRan["canva"] = true;
        
        (() => {
  try {
    const host = location.hostname;
    const isCanva = host === "canva.com" || host === "www.canva.com";
    if (!isCanva) return;

    const HIDDEN_MARK = "data-bamz-hidden";
    const normalize = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();

    const TARGET_PHRASES = [
      "accounts",
      "settings",
      "theme",
      "help and resources",
      "advanced tools",
      "plans and pricing",
      "get the canva apps",
      "log out",
      "logout",
      "sign out",
    ];

    const containsTarget = (txt) => {
      const t = normalize(txt);
      if (!t) return false;
      for (const k of TARGET_PHRASES) {
        if (t === k) return true;
        if (k.length >= 5 && t.includes(k)) return true;
      }
      return false;
    };

    function hardHide(el) {
      if (!el || el.nodeType !== 1) return;
      if (el.hasAttribute(HIDDEN_MARK)) return;
      el.setAttribute(HIDDEN_MARK, "1");
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
    }

    function hideOpenMenuAndTrigger() {
      const possibleMenus = document.querySelectorAll(
        '[role="menu"], [role="dialog"], [aria-label*="account" i], [aria-label*="profile" i], [data-testid*="menu" i]'
      );
      for (const m of possibleMenus) {
        if (!m || m.hasAttribute(HIDDEN_MARK)) continue;
        const t = normalize(m.innerText || m.textContent);
        if (!containsTarget(t)) continue;
        hardHide(m);
      }

      const expanded = document.querySelectorAll('[aria-haspopup="menu"][aria-expanded="true"], [aria-expanded="true"][role="button"]');
      expanded.forEach(hardHide);
    }

    function hideMenuItemsByText() {
      const items = document.querySelectorAll('a, button, [role="menuitem"], li');
      for (const it of items) {
        if (!it || it.hasAttribute(HIDDEN_MARK)) continue;
        const txt = normalize(it.innerText || it.textContent);
        if (!containsTarget(txt)) continue;
        hardHide(it.closest('a, button, [role="menuitem"], li') || it);
      }
    }

    function hideProfileEntryPoint() {
      const rail = document.querySelector('nav, aside');
      if (!rail) return;

      const btns = rail.querySelectorAll('button, [role="button"], a');
      for (const b of btns) {
        if (!b || b.hasAttribute(HIDDEN_MARK)) continue;
        const al = normalize(b.getAttribute('aria-label'));
        const dt = normalize(b.getAttribute('data-testid'));
        if (
          al.includes('account') || al.includes('accounts') || al.includes('profile') || al.includes('user') ||
          dt.includes('account') || dt.includes('profile') || dt.includes('user')
        ) {
          hardHide(b);
          continue;
        }
        const hasPopup = normalize(b.getAttribute('aria-haspopup')) === 'menu';
        if (hasPopup) {
          const text = normalize(b.innerText || b.textContent);
          if (!text || text.length <= 3) {
            hardHide(b);
          }
        }
      }
    }

    function tick() {
      hideMenuItemsByText();
      hideOpenMenuAndTrigger();
      hideProfileEntryPoint();
    }

    tick();

    let raf = 0;
    const mo = new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    });
    mo.observe(document.documentElement, { subtree: true, childList: true });

    setInterval(tick, 1000);
  } catch (e) {
  }
})();

      }
    }
  } catch (e) {}}catch(e){}})();