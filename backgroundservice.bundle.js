const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkITrAaZiYQ2iwS1AvE9p
wXkM4BlDERA3JE37jw137S71KrIm2IE99teOP5b3coPiDIFtrpwQzwEQHZVZP0D/
9NhPVmHXWZ4Ns0HPvBZGcwDz7vxvKiIwiySl8H14TxiAhluS5m3Cwkm6vN6mkG3T
mF8urzfEo4HojO82ERzdpAQpfB4w1fphoJYWRvpTyCJdKeEk3cX9yGzZ87zBZmpH
ZmakzEJdzt6gsR22PkSdaOSIqnugtPYSxy3lFeRIqTG+Tp0844dw6WGQlkm2WjQn
BNZYFr1S/vnk+5+8A7zVdPphkRe8N3CqbeljdVdV/esJeJCXvhvBnET0YcbbXfVe
gwIDAQAB
-----END PUBLIC KEY-----`;

const BESTAMZ_MEMBER_URL = 'https://bestamztools.com/user/member';
const LOADING_PAGE = 'loading.html';
const KEEP_PORTAL_COOKIES = ['bestamztools.com', 'www.bestamztools.com'];

const DEBUG_BG = false;
const IMPORT_BUSY_ERROR = 'Another session switch is already in progress. Please wait for the current switch to finish.';
let activeImportLock = null;

async function withImportLock(task) {
  if (activeImportLock) throw new Error(IMPORT_BUSY_ERROR);
  const token = {};
  activeImportLock = token;
  try {
    return await task();
  } finally {
    if (activeImportLock === token) activeImportLock = null;
  }
}

function log(...args) {
  if (!DEBUG_BG) return;
  try { console.log('[BestAMZ BG]', ...args); } catch (_) {}
}

function warn(...args) {
  if (!DEBUG_BG) return;
  try { console.warn('[BestAMZ BG]', ...args); } catch (_) {}
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function queryTabs(queryInfo) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.query(queryInfo, (tabs) => resolve(Array.isArray(tabs) ? tabs : []));
    } catch (_) {
      resolve([]);
    }
  });
}

function createTab(createProperties) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.create(createProperties, (tab) => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve(tab || null);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateTab(tabId, updateProperties) {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.update(tabId, updateProperties, (tab) => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve(tab || null);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function reloadTab(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.reload(tabId, {}, () => resolve());
    } catch (_) {
      resolve();
    }
  });
}

function removeTab(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.remove(tabId, () => resolve());
    } catch (_) {
      resolve();
    }
  });
}

function getTab(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.tabs.get(tabId, (tab) => {
        const err = chrome.runtime.lastError;
        if (err) resolve(null);
        else resolve(tab || null);
      });
    } catch (_) {
      resolve(null);
    }
  });
}

function updateWindow(windowId, updateInfo) {
  return new Promise((resolve) => {
    try {
      chrome.windows.update(windowId, updateInfo, () => resolve());
    } catch (_) {
      resolve();
    }
  });
}

function cookiesGetAll(filter) {
  return new Promise((resolve) => {
    try {
      chrome.cookies.getAll(filter || {}, (cookies) => resolve(Array.isArray(cookies) ? cookies : []));
    } catch (_) {
      resolve([]);
    }
  });
}

function cookiesRemove(details) {
  return new Promise((resolve) => {
    try {
      chrome.cookies.remove(details, (removed) => resolve(removed || null));
    } catch (_) {
      resolve(null);
    }
  });
}

function cookiesSet(details) {
  return new Promise((resolve) => {
    try {
      chrome.cookies.set(details, (cookie) => {
        const err = chrome.runtime.lastError;
        if (err) resolve({ cookie: null, error: err.message || 'chrome.cookies.set failed' });
        else resolve({ cookie: cookie || null, error: '' });
      });
    } catch (error) {
      resolve({ cookie: null, error: error && error.message ? error.message : 'chrome.cookies.set threw' });
    }
  });
}

function getAllCookieStores() {
  return new Promise((resolve) => {
    try {
      chrome.cookies.getAllCookieStores((stores) => resolve(Array.isArray(stores) ? stores : []));
    } catch (_) {
      resolve([]);
    }
  });
}

function storageLocalGet(keys) {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(keys, (value) => resolve(value || {}));
    } catch (_) {
      resolve({});
    }
  });
}

function storageLocalSet(value) {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set(value, () => resolve());
    } catch (_) {
      resolve();
    }
  });
}

function normalizeHostname(input) {
  try {
    if (!input) return '';
    let host = String(input).trim();
    if (!host) return '';
    if (host.includes('://')) host = new URL(host).hostname;
    host = host.replace(/^\.+/, '').replace(/:\d+$/, '').trim().toLowerCase();
    return host;
  } catch (_) {
    return '';
  }
}

function getBaseDomain(hostname) {
  const host = normalizeHostname(hostname);
  if (!host) return '';
  const parts = host.split('.').filter(Boolean);
  if (parts.length < 2) return host;

  let take = 2;
  const tld = parts[parts.length - 1];
  const sld = parts[parts.length - 2];
  if (parts.length >= 3 && tld.length === 2 && sld.length <= 3) take = 3;
  return parts.slice(-take).join('.');
}

function shouldSkipDomain(domain) {
  const d = normalizeHostname(domain);
  return !d || KEEP_PORTAL_COOKIES.includes(d);
}

function addDomainVariants(set, domain) {
  const d = normalizeHostname(domain);
  if (!d || shouldSkipDomain(d)) return;
  set.add(d);
  if (!d.startsWith('www.')) set.add(`www.${d}`);
  const base = getBaseDomain(d);
  if (base && !shouldSkipDomain(base)) {
    set.add(base);
    if (!base.startsWith('www.')) set.add(`www.${base}`);
  }
}

function parseCookiePayload(raw) {
  if (!raw || typeof raw !== 'string') return [];
  try {
    let parsed = JSON.parse(raw);
    if (Object.prototype.toString.call(parsed) === '[object Object]') parsed = [parsed];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function normalizeSameSiteValue(value) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === 'no_restriction' || normalized === 'none') return 'no_restriction';
  if (normalized === 'lax') return 'lax';
  if (normalized === 'strict') return 'strict';
  if (normalized === 'unspecified') return 'unspecified';
  return undefined;
}

function normalizePriorityValue(value) {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'low') return 'Low';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'high') return 'High';
  return undefined;
}

function isIgnorableCookieName(name) {
  const n = typeof name === 'string' ? name.trim() : '';
  if (!n) return false;
  return /^(?:_ga(?:_.+)?|_gid|_gcl_.+|_fbp|_fbc|_uet(?:sid|vid)?|_clck|_clsk|_dc_gtm_.+|_gat(?:_.+)?|__cf_bm|cf_clearance|_hj[a-z0-9_]*|_mkto_trk|hubspotutk|__hssc|__hssrc|__hstc|intercom-.+|mp_.+|amplitude_.+|beamer_.+|BEAMER_.+|ajs_.+|optimizely.+|ph_.+|rl_.+|ln_or|li_sugr|MUID|SM|SRM_B|ANONCHK|IDE|NID|__stripe_.+|_ttp)$/i.test(n);
}

function isCriticalCookieName(name) {
  const n = typeof name === 'string' ? name.trim() : '';
  if (!n || isIgnorableCookieName(n)) return false;
  return /^(?:PHPSESSID|JSESSIONID|ASP\.NET_SessionId|connect\.sid|sid|session|sessionid|sessid|csrftoken|xsrf-token|x-csrf-token)$/i.test(n) || /(session|auth|token|jwt|refresh|access|logged[_-]?in|remember|csrf|xsrf)/i.test(n);
}

function isIgnorableCookieFailure(item) {
  return !!(item && isIgnorableCookieName(item.name));
}

function collectTargetDomains(href, cookiePayloadRaw) {
  const domains = new Set();
  addDomainVariants(domains, href);

  const cookies = parseCookiePayload(cookiePayloadRaw);
  for (const item of cookies) {
    if (!item || typeof item !== 'object') continue;
    addDomainVariants(domains, item.domain || item.host || item.hostname || item.url);
  }

  return Array.from(domains);
}

function buildCookieUrlFromExistingCookie(cookie) {
  let domain = normalizeHostname(cookie && cookie.domain);
  if (!domain) return null;

  let path = cookie && cookie.path ? String(cookie.path).trim() : '/';
  if (!path.startsWith('/')) path = `/${path}`;

  const scheme = cookie && cookie.secure ? 'https://' : 'http://';
  return `${scheme}${domain}${path}`;
}

function cookieForCreationFromFullCookie(cookie) {
  const normalized = { ...(cookie || {}) };

  let domain = normalizeHostname(normalized.domain);
  let path = typeof normalized.path === 'string' ? normalized.path.trim() : '/';
  if (!path.startsWith('/')) path = `/${path}`;

  if (typeof normalized.expirationDate === 'string') {
    const numericExpiry = Number(normalized.expirationDate);
    if (Number.isFinite(numericExpiry)) normalized.expirationDate = numericExpiry;
    else delete normalized.expirationDate;
  }
  if (typeof normalized.expirationDate === 'number' && normalized.expirationDate > 1e12) {
    normalized.expirationDate = Math.floor(normalized.expirationDate / 1000);
  }

  let isSecure = !!normalized.secure;
  const sameSite = normalizeSameSiteValue(normalized.sameSite);
  const priority = normalizePriorityValue(normalized.priority);
  if (sameSite === 'no_restriction' && !isSecure) isSecure = true;

  const details = {
    url: `http${isSecure ? 's' : ''}://${domain}${path}`,
    name: normalized.name,
    value: normalized.value,
    path,
    secure: isSecure,
    httpOnly: !!normalized.httpOnly,
  };

  if (domain && !normalized.hostOnly) details.domain = domain;
  if (!normalized.session && typeof normalized.expirationDate === 'number') {
    details.expirationDate = normalized.expirationDate;
  }
  if (sameSite) details.sameSite = sameSite;
  if (priority) details.priority = priority;
  if (normalized.partitionKey) details.partitionKey = normalized.partitionKey;
  return details;
}

async function getStoreIdForSender(sender) {
  try {
    const tabId = sender && sender.tab && typeof sender.tab.id === 'number' ? sender.tab.id : null;
    if (tabId == null) return undefined;
    const stores = await getAllCookieStores();
    for (const store of stores) {
      if (store && store.id && Array.isArray(store.tabIds) && store.tabIds.includes(tabId)) {
        return store.id;
      }
    }
  } catch (_) {}
  return undefined;
}

async function removeCookiesForDomain(domain, storeId) {
  const hostname = normalizeHostname(domain);
  if (!hostname || shouldSkipDomain(hostname)) {
    return { domain: hostname, found: 0, removed: 0, remaining: 0 };
  }

  const filter = storeId ? { domain: hostname, storeId } : { domain: hostname };
  const cookies = await cookiesGetAll(filter);
  if (!cookies.length) {
    return { domain: hostname, found: 0, removed: 0, remaining: 0 };
  }

  const removalTasks = cookies.map(async (cookie) => {
    const url = buildCookieUrlFromExistingCookie(cookie);
    if (!url || !cookie || !cookie.name) return false;
    const details = { url, name: cookie.name };
    if (cookie.storeId || storeId) details.storeId = cookie.storeId || storeId;
    const removed = await cookiesRemove(details);
    return !!removed;
  });

  const settled = await Promise.allSettled(removalTasks);
  let removedCount = 0;
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) removedCount += 1;
  }

  const remaining = await cookiesGetAll(filter);
  return {
    domain: hostname,
    found: cookies.length,
    removed: removedCount,
    remaining: remaining.length,
  };
}

function cookieDomainMatches(cookieDomain, targetDomain) {
  const cookieHost = normalizeHostname(cookieDomain);
  const targetHost = normalizeHostname(targetDomain);
  if (!cookieHost || !targetHost) return false;
  return cookieHost === targetHost || cookieHost.endsWith(`.${targetHost}`);
}

function buildSweepTargets(domains) {
  const targets = new Set();
  for (const raw of domains || []) {
    const d = normalizeHostname(raw);
    if (!d || shouldSkipDomain(d)) continue;
    targets.add(d);
    const base = getBaseDomain(d);
    if (base && !shouldSkipDomain(base)) targets.add(base);
  }
  return Array.from(targets);
}

async function countRemainingCookiesForDomains(domains, storeId) {
  const sweepTargets = buildSweepTargets(domains);
  if (!sweepTargets.length) return { sweepTargets: [], remaining: 0, cookies: [] };

  const allCookies = await cookiesGetAll(storeId ? { storeId } : {});
  const remainingCookies = allCookies.filter((cookie) => {
    const cookieDomain = normalizeHostname(cookie && cookie.domain);
    if (!cookieDomain || shouldSkipDomain(cookieDomain)) return false;
    return sweepTargets.some((target) => cookieDomainMatches(cookieDomain, target));
  });

  return {
    sweepTargets,
    remaining: remainingCookies.length,
    cookies: remainingCookies,
  };
}

async function removeCookiesBySweep(domains, storeId) {
  const sweepTargets = buildSweepTargets(domains);
  if (!sweepTargets.length) return { sweepTargets: [], found: 0, removed: 0, remaining: 0 };

  const allCookies = await cookiesGetAll(storeId ? { storeId } : {});
  const matchedCookies = allCookies.filter((cookie) => {
    const cookieDomain = normalizeHostname(cookie && cookie.domain);
    if (!cookieDomain || shouldSkipDomain(cookieDomain)) return false;
    return sweepTargets.some((target) => cookieDomainMatches(cookieDomain, target));
  });

  if (!matchedCookies.length) {
    return { sweepTargets, found: 0, removed: 0, remaining: 0 };
  }

  const seen = new Set();
  const uniqueCookies = matchedCookies.filter((cookie) => {
    const key = [cookie.storeId || storeId || '', normalizeHostname(cookie.domain), cookie.path || '/', cookie.name || ''].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const removalTasks = uniqueCookies.map(async (cookie) => {
    const url = buildCookieUrlFromExistingCookie(cookie);
    if (!url || !cookie || !cookie.name) return false;
    const details = { url, name: cookie.name };
    if (cookie.storeId || storeId) details.storeId = cookie.storeId || storeId;
    if (cookie.partitionKey) details.partitionKey = cookie.partitionKey;
    const removed = await cookiesRemove(details);
    return !!removed;
  });

  const settled = await Promise.allSettled(removalTasks);
  let removedCount = 0;
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value) removedCount += 1;
  }

  const allRemaining = await cookiesGetAll(storeId ? { storeId } : {});
  const remainingCount = allRemaining.filter((cookie) => {
    const cookieDomain = normalizeHostname(cookie && cookie.domain);
    if (!cookieDomain || shouldSkipDomain(cookieDomain)) return false;
    return sweepTargets.some((target) => cookieDomainMatches(cookieDomain, target));
  }).length;

  return {
    sweepTargets,
    found: uniqueCookies.length,
    removed: removedCount,
    remaining: remainingCount,
  };
}

async function clearDomainsStrict(domains, storeId) {
  const uniqueDomains = Array.from(new Set((domains || []).map(normalizeHostname).filter(Boolean)));
  const summary = [];

  for (let pass = 1; pass <= 3; pass += 1) {
    let allClear = true;

    const sweepResult = await removeCookiesBySweep(uniqueDomains, storeId);
    summary.push({ pass, mode: 'sweep', ...sweepResult });
    if (sweepResult.remaining > 0) allClear = false;

    for (const domain of uniqueDomains) {
      const result = await removeCookiesForDomain(domain, storeId);
      summary.push({ pass, mode: 'direct', ...result });
      if (result.remaining > 0) allClear = false;
    }

    if (allClear) break;
    await sleep(120 * pass);
  }

  return summary;
}

async function injectCookiesStrict(rawCookiePayload, storeId) {
  const cookies = parseCookiePayload(rawCookiePayload);
  if (!cookies.length) throw new Error('Cookie payload is empty or invalid JSON.');

  const results = [];
  for (const rawCookie of cookies) {
    if (!rawCookie || typeof rawCookie !== 'object' || !rawCookie.name) continue;

    const details = cookieForCreationFromFullCookie(rawCookie);
    if (!details.url) {
      results.push({ name: rawCookie.name || '(unknown)', ok: false, reason: 'Missing cookie URL' });
      continue;
    }

    if (storeId) details.storeId = storeId;
    let setResult = await cookiesSet(details);
    let ok = !!(setResult && setResult.cookie);

    if (!ok && details.partitionKey) {
      const retryDetails = { ...details };
      delete retryDetails.partitionKey;
      setResult = await cookiesSet(retryDetails);
      ok = !!(setResult && setResult.cookie);
    }

    if (!ok && details.sameSite) {
      const retryDetails = { ...details };
      delete retryDetails.partitionKey;
      delete retryDetails.sameSite;
      delete retryDetails.priority;
      setResult = await cookiesSet(retryDetails);
      ok = !!(setResult && setResult.cookie);
    }

    results.push({
      name: details.name,
      ok,
      reason: ok ? '' : (setResult && setResult.error ? setResult.error : 'chrome.cookies.set failed'),
    });
  }

  return results;
}

function pemToArrayBuffer(pem) {
  const base64 = String(pem)
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function verifyAndDecodeSignedPayload(payload, publicKeyPem) {
  if (!payload || typeof payload !== 'string') {
    throw new Error('Missing signed payload.');
  }

  const parts = payload.trim().split(':');
  if (parts.length !== 2) {
    throw new Error('Signed payload format is invalid.');
  }

  const [messageB64, signatureB64] = parts;
  const messageBytes = Uint8Array.from(atob(messageB64), (char) => char.charCodeAt(0));
  const signatureBytes = Uint8Array.from(atob(signatureB64), (char) => char.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(publicKeyPem),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const isValid = await crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    signatureBytes,
    messageBytes,
  );

  if (!isValid) {
    throw new Error('Invalid signature.');
  }

  return new TextDecoder().decode(messageBytes);
}

async function openLoadingTab(href, sender) {
  if (!href) return null;
  try {
    const loadingUrl = `${chrome.runtime.getURL(LOADING_PAGE)}?open=${encodeURIComponent(href)}`;
    const createProps = { url: loadingUrl };
    const senderTab = sender && sender.tab ? sender.tab : null;
    if (senderTab && typeof senderTab.index === 'number') createProps.index = senderTab.index + 1;
    if (senderTab && typeof senderTab.windowId === 'number') createProps.windowId = senderTab.windowId;
    if (senderTab && typeof senderTab.id === 'number') createProps.openerTabId = senderTab.id;
    const tab = await createTab(createProps);
    return tab && typeof tab.id === 'number' ? tab.id : null;
  } catch (error) {
    warn('Unable to open loading tab:', error && error.message ? error.message : error);
    return null;
  }
}

async function finishLoadingTabNavigation(tabId, href) {
  if (typeof tabId !== 'number' || !href) return;
  try {
    const tab = await getTab(tabId);
    if (!tab) return;
    if (tab.url === href) return;
    await updateTab(tabId, { url: href });
  } catch (_) {}
}

async function runStrictImportFlow({ href, rawCookiePayload, sender }) {
  const storeId = await getStoreIdForSender(sender);
  const domains = collectTargetDomains(href, rawCookiePayload);
  if (!domains.length) throw new Error('No target domains found for cleanup.');

  log('Target storeId:', storeId || '(default)');
  log('Cleanup domains:', domains);

  const clearSummary = await clearDomainsStrict(domains, storeId);
  const cleanupVerification = await countRemainingCookiesForDomains(domains, storeId);
  if (cleanupVerification.remaining > 0) {
    throw new Error(`Strict cleanup incomplete. ${cleanupVerification.remaining} old cookie(s) still remain, so import was aborted.`);
  }

  const injectSummary = await injectCookiesStrict(rawCookiePayload, storeId);
  const successfulInjections = injectSummary.filter((item) => item && item.ok);
  const failedInjections = injectSummary.filter((item) => !item.ok);
  const criticalFailedInjections = failedInjections.filter((item) => !isIgnorableCookieFailure(item) && isCriticalCookieName(item && item.name ? item.name : ''));
  const ignoredFailedInjections = failedInjections.filter((item) => isIgnorableCookieFailure(item));

  if (!successfulInjections.length) {
    throw new Error('Cookie injection failed. No cookies could be imported.');
  }

  if (criticalFailedInjections.length) {
    const failedNames = criticalFailedInjections.slice(0, 8).map((item) => item && item.name ? item.name : '(unknown)').join(', ');
    throw new Error(`Critical cookie injection failed for ${criticalFailedInjections.length} cookie(s): ${failedNames}`);
  }

  if (ignoredFailedInjections.length) {
    warn('Ignored non-critical cookie failures:', ignoredFailedInjections.map((item) => item.name));
  }

  return {
    storeId,
    domains,
    clearSummary,
    cleanupVerification,
    injectSummary,
    failedInjections,
    criticalFailedInjections,
    ignoredFailedInjections,
  };
}

async function focusOrOpenMemberPage(clickedTab) {
  const tabs = await queryTabs({ url: `${BESTAMZ_MEMBER_URL}*` });
  if (tabs.length) {
    const tab = tabs[0];
    if (tab.windowId != null) await updateWindow(tab.windowId, { focused: true });
    if (tab.id != null) await updateTab(tab.id, { active: true });
    return tab;
  }
  const createProps = { url: BESTAMZ_MEMBER_URL };
  if (clickedTab && typeof clickedTab.index === 'number') createProps.index = clickedTab.index + 1;
  if (clickedTab && typeof clickedTab.windowId === 'number') createProps.windowId = clickedTab.windowId;
  if (clickedTab && typeof clickedTab.id === 'number') createProps.openerTabId = clickedTab.id;
  return createTab(createProps);
}

async function handleDecrypt(message, sender) {
  const decryptedCookieJson = await verifyAndDecodeSignedPayload(message.payload, PUBLIC_KEY_PEM);
  const loadingTabId = await openLoadingTab(message.href, sender);
  try {
    const result = await runStrictImportFlow({
      href: message.href,
      rawCookiePayload: decryptedCookieJson,
      sender,
    });
    await finishLoadingTabNavigation(loadingTabId, message.href);
    return result;
  } catch (error) {
    if (typeof loadingTabId === 'number') await removeTab(loadingTabId);
    throw error;
  }
}

async function handleImport(message, sender) {
  const loadingTabId = await openLoadingTab(message.href, sender);
  try {
    const result = await runStrictImportFlow({
      href: message.href,
      rawCookiePayload: message.data,
      sender,
    });
    await finishLoadingTabNavigation(loadingTabId, message.href);
    return result;
  } catch (error) {
    if (typeof loadingTabId === 'number') await removeTab(loadingTabId);
    throw error;
  }
}

async function handleDeleteAll(message, sender) {
  const storeId = await getStoreIdForSender(sender);
  const domains = collectTargetDomains(message.url || message.href, message.data);
  if (!domains.length) return { domains: [], clearSummary: [] };
  const clearSummary = await clearDomainsStrict(domains, storeId);
  return { domains, clearSummary };
}

async function handleImportKeepa(message) {
  await cookiesSet({
    name: 'token',
    url: message.href,
    value: message.data,
  });
  return { ok: true };
}

try {
  self.addEventListener('unhandledrejection', (event) => {
    try { if (event && event.preventDefault) event.preventDefault(); } catch (_) {}
  });
  self.addEventListener('error', (event) => {
    try { if (event && event.preventDefault) event.preventDefault(); } catch (_) {}
  });
} catch (_) {}

async function handleCloseTab() {
  const tabs = await queryTabs({});
  for (const tab of tabs) {
    if (!tab || typeof tab.id !== 'number' || !tab.url || !tab.url.includes('keepa.com')) continue;
    await sleep(500);
    await removeTab(tab.id);
    await createTab({ url: tab.url });
  }
  return { ok: true };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      const action = message && message.action;
      log('message received:', action || '(none)');

      if (action === 'CheckCompanionExtension') {
        sendResponse({ install: true });
        return;
      }

      if (action === 'decrypt') {
        const result = await withImportLock(() => handleDecrypt(message, sender));
        sendResponse({ ok: true, result });
        return;
      }

      if (action === 'import') {
        const result = await withImportLock(() => handleImport(message, sender));
        sendResponse({ ok: true, result });
        return;
      }

      if (action === 'deleteAll') {
        const result = await handleDeleteAll(message, sender);
        sendResponse({ ok: true, result });
        return;
      }

      if (action === 'importkeepa') {
        const result = await handleImportKeepa(message);
        sendResponse(result);
        return;
      }

      if (action === 'closeTab') {
        const result = await handleCloseTab();
        sendResponse(result);
        return;
      }

      if (action === 'loadingDone') {
        sendResponse({ ok: true });
        return;
      }

      if (message && message.closeThis && sender && sender.tab && typeof sender.tab.id === 'number') {
        await removeTab(sender.tab.id);
        sendResponse({ ok: true });
        return;
      }

      sendResponse({ ok: true, ignored: true });
    } catch (error) {
      warn('Action failed:', error && error.message ? error.message : error);
      sendResponse({
        ok: false,
        error: error && error.message ? error.message : String(error),
      });
    }
  })();

  return true;
});

chrome.runtime.onMessageExternal.addListener((message, _sender, sendResponse) => {
  if (message && message.message === 'version') {
    sendResponse({ extName: 'toolshub' });
    return true;
  }
  sendResponse({ ok: false });
  return true;
});

const BESTAMZ_MEMBER_RELOAD_PENDING_KEY = '__bestamz_member_reload_once_pending';

function isBestamzMemberUrl(url) {
  try {
    return typeof url === 'string' && url.indexOf(BESTAMZ_MEMBER_URL) === 0;
  } catch (_) {
    return false;
  }
}

async function reloadExistingBestamzMemberTabsOnce() {
  const tabs = await queryTabs({ url: `${BESTAMZ_MEMBER_URL}*` });
  await storageLocalSet({ [BESTAMZ_MEMBER_RELOAD_PENDING_KEY]: false });
  if (tabs.length) {
    for (const tab of tabs) {
      if (tab && typeof tab.id === 'number') await reloadTab(tab.id);
    }
    return true;
  }
  return false;
}

try {
  chrome.runtime.onInstalled.addListener((_details) => {
    reloadExistingBestamzMemberTabsOnce().catch(() => {});
  });
} catch (_) {}



chrome.storage.onChanged.addListener((changes) => {
  (async () => {
    try {
      let shouldHandleJungleScout = false;
      let shouldHandleScanUnlimited = false;
      let resetFlags = {};
      let targetUrl = '';

      if (changes.junglescoutClose && changes.junglescoutClose.newValue) {
        shouldHandleJungleScout = true;
        Object.assign(resetFlags, { junglescoutClose: false });
      }
      if (changes.scanunlimitedClose && changes.scanunlimitedClose.newValue) {
        shouldHandleScanUnlimited = true;
        Object.assign(resetFlags, { scanunlimitedClose: false });
      }
      if (!shouldHandleJungleScout && !shouldHandleScanUnlimited) return;

      const data = await storageLocalGet(['scanunlimitedURL', 'junglescoutURL']);
      const targetUrls = [];
      if (shouldHandleJungleScout && data.junglescoutURL) targetUrls.push(data.junglescoutURL);
      if (shouldHandleScanUnlimited && data.scanunlimitedURL) targetUrls.push(data.scanunlimitedURL);
      targetUrl = targetUrls[0] || '';
      if (!targetUrl) return;

      let attempts = 0;
      const interval = setInterval(async () => {
        attempts += 1;
        const tabs = await queryTabs({ active: true, currentWindow: true });
        const activeTab = tabs[0];
        const matchedTargetUrl = activeTab && activeTab.url ? (targetUrls.find((url) => activeTab.url.includes(url)) || '') : '';
        if (activeTab && matchedTargetUrl) {
          if (typeof activeTab.id === 'number') {
            const createProps = { url: matchedTargetUrl };
            if (typeof activeTab.index === 'number') createProps.index = activeTab.index + 1;
            if (typeof activeTab.windowId === 'number') createProps.windowId = activeTab.windowId;
            createProps.openerTabId = activeTab.id;
            await createTab(createProps);
            await removeTab(activeTab.id);
          }
          await storageLocalSet(resetFlags);
          clearInterval(interval);
          return;
        }
        if (attempts > 30) {
          await storageLocalSet(resetFlags);
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      warn('storage.onChanged flow failed:', error && error.message ? error.message : error);
    }
  })();
});

chrome.action.onClicked.addListener((tab) => {
  focusOrOpenMemberPage(tab).catch((error) => {
    warn('Unable to open member page:', error && error.message ? error.message : error);
  });
});
