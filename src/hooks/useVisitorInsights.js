import { useEffect, useState } from 'react';

const COUNTER_NAMESPACE = 'huyphan68080-profile';
const COUNTER_KEY = 'portfolio-visits';
const VIEW_HIT_SESSION_KEY = 'portfolio-view-hit-v1';
const VIEW_LOCAL_HIT_SESSION_KEY = 'portfolio-local-view-hit-v1';
const VIEW_LOCAL_COUNTER_KEY = 'portfolio-local-view-count-v1';
const VISITOR_LOGGED_SESSION_KEY = 'portfolio-visitor-logged-v1';
const VISITOR_HISTORY_KEY = 'portfolio-visitor-history-v1';
const VISITOR_GEO_CACHE_KEY = 'portfolio-visitor-geo-cache-v1';

const MAX_VISITOR_HISTORY = 12;
const MAX_GEO_CACHE = 60;
const GEO_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const UNKNOWN_TEXT = 'Unknown';

const CURRENT_VISITOR_ENDPOINTS = ['https://ipapi.co/json/', 'https://ipwho.is/', 'https://ipinfo.io/json'];

const normalizeText = (value) => (typeof value === 'string' && value.trim() ? value.trim() : '');

const pickFirstText = (...values) => {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return '';
};

const isKnownValue = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return false;
  return normalized.toLowerCase() !== UNKNOWN_TEXT.toLowerCase();
};

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toSafeNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
};

const buildVisitorRecord = ({ ip, city, region, country, timezone, provider, visitedAt }) => {
  const normalizedIp = normalizeText(ip);
  if (!normalizedIp) return null;

  return {
    ip: normalizedIp,
    city: isKnownValue(city) ? normalizeText(city) : UNKNOWN_TEXT,
    region: isKnownValue(region) ? normalizeText(region) : UNKNOWN_TEXT,
    country: isKnownValue(country) ? normalizeText(country) : UNKNOWN_TEXT,
    timezone: isKnownValue(timezone) ? normalizeText(timezone) : UNKNOWN_TEXT,
    provider: isKnownValue(provider) ? normalizeText(provider) : UNKNOWN_TEXT,
    visitedAt: normalizeText(visitedAt) || new Date().toISOString(),
  };
};

const normalizeVisitor = (raw, visitedAt = new Date().toISOString()) => {
  if (!raw || typeof raw !== 'object' || raw.success === false) return null;

  const ip = pickFirstText(raw.ip, raw.query, raw.data?.ip);
  if (!ip) return null;

  return buildVisitorRecord({
    ip,
    city: pickFirstText(raw.city, raw.location?.city),
    region: pickFirstText(raw.region, raw.region_name, raw.location?.region),
    country: pickFirstText(raw.country_name, raw.country, raw.country_code, raw.countryCode, raw.location?.country),
    timezone: pickFirstText(raw.timezone, raw.timezone?.id, raw.location?.timezone),
    provider: pickFirstText(
      raw.org,
      raw.network,
      raw.isp,
      raw.connection?.isp,
      raw.connection?.org,
      raw.asn?.name,
      raw.company?.name,
    ),
    visitedAt,
  });
};

const hasKnownVisitorMeta = (visitor) => {
  if (!visitor || typeof visitor !== 'object') return false;
  return ['city', 'region', 'country', 'timezone', 'provider'].some((field) => isKnownValue(visitor[field]));
};

const pickKnownOrFallback = (first, second) => {
  if (isKnownValue(first)) return normalizeText(first);
  if (isKnownValue(second)) return normalizeText(second);

  const normalizedFirst = normalizeText(first);
  if (normalizedFirst) return normalizedFirst;
  const normalizedSecond = normalizeText(second);
  if (normalizedSecond) return normalizedSecond;
  return UNKNOWN_TEXT;
};

const mergeVisitors = (baseVisitor, nextVisitor) => {
  if (!baseVisitor) return nextVisitor;
  if (!nextVisitor) return baseVisitor;

  return buildVisitorRecord({
    ip: pickFirstText(baseVisitor.ip, nextVisitor.ip),
    city: pickKnownOrFallback(baseVisitor.city, nextVisitor.city),
    region: pickKnownOrFallback(baseVisitor.region, nextVisitor.region),
    country: pickKnownOrFallback(baseVisitor.country, nextVisitor.country),
    timezone: pickKnownOrFallback(baseVisitor.timezone, nextVisitor.timezone),
    provider: pickKnownOrFallback(baseVisitor.provider, nextVisitor.provider),
    visitedAt: pickFirstText(baseVisitor.visitedAt, nextVisitor.visitedAt, new Date().toISOString()),
  });
};

const loadVisitorHistory = () => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(VISITOR_HISTORY_KEY);
  if (!raw) return [];

  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((item) => item && typeof item === 'object' && typeof item.ip === 'string')
    .map((item) => buildVisitorRecord(item))
    .filter(Boolean);
};

const saveVisitorHistory = (history) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VISITOR_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_VISITOR_HISTORY)));
};

const appendVisitorHistory = (visitor) => {
  const history = loadVisitorHistory();
  const deduped = history.filter((item) => item.ip !== visitor.ip);
  const nextHistory = [visitor, ...deduped].slice(0, MAX_VISITOR_HISTORY);
  saveVisitorHistory(nextHistory);
  return nextHistory;
};

const visitorsEqual = (left, right) => {
  if (!left || !right) return false;
  return (
    left.ip === right.ip &&
    left.city === right.city &&
    left.region === right.region &&
    left.country === right.country &&
    left.timezone === right.timezone &&
    left.provider === right.provider &&
    left.visitedAt === right.visitedAt
  );
};

const fetchJson = async (url, signal) => {
  const response = await fetch(url, { signal, cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const getStoredLocalViewCount = () => {
  if (typeof window === 'undefined') return 0;
  return toSafeNumber(window.localStorage.getItem(VIEW_LOCAL_COUNTER_KEY));
};

const bumpLocalViewCount = () => {
  if (typeof window === 'undefined') return 0;

  const hasLocalHitInSession = window.sessionStorage.getItem(VIEW_LOCAL_HIT_SESSION_KEY) === '1';
  const currentValue = getStoredLocalViewCount();
  if (hasLocalHitInSession) {
    return currentValue > 0 ? currentValue : 1;
  }

  const nextValue = currentValue + 1;
  window.localStorage.setItem(VIEW_LOCAL_COUNTER_KEY, String(nextValue));
  window.sessionStorage.setItem(VIEW_LOCAL_HIT_SESSION_KEY, '1');
  return nextValue;
};

const clearLegacyVisitorStorage = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(VISITOR_HISTORY_KEY);
  window.localStorage.removeItem(VISITOR_GEO_CACHE_KEY);
  window.sessionStorage.removeItem(VISITOR_LOGGED_SESSION_KEY);
};

const fetchViewCount = async (signal) => {
  if (typeof window === 'undefined') {
    return { value: 0, source: 'local' };
  }

  const hasHitInSession = window.sessionStorage.getItem(VIEW_HIT_SESSION_KEY) === '1';
  const endpoint = hasHitInSession
    ? `https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
    : `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

  try {
    const payload = await fetchJson(endpoint, signal);
    if (!hasHitInSession) {
      window.sessionStorage.setItem(VIEW_HIT_SESSION_KEY, '1');
    }

    if (typeof payload?.value === 'number') {
      return { value: payload.value, source: 'global' };
    }
  } catch {
    // Use local fallback below.
  }

  return { value: bumpLocalViewCount(), source: 'local' };
};

const buildIpLookupEndpoints = (ip) => {
  const encoded = encodeURIComponent(ip);
  return [`https://ipapi.co/${encoded}/json/`, `https://ipwho.is/${encoded}`, `https://ipinfo.io/${encoded}/json`];
};

const fetchVisitorFromEndpoints = async (endpoints, signal, visitedAt) => {
  let fallbackCandidate = null;

  for (const endpoint of endpoints) {
    try {
      const payload = await fetchJson(endpoint, signal);
      const normalized = normalizeVisitor(payload, visitedAt);
      if (!normalized) continue;

      if (!fallbackCandidate) {
        fallbackCandidate = normalized;
      }
      if (hasKnownVisitorMeta(normalized)) {
        return normalized;
      }
    } catch {
      // Try next provider.
    }
  }

  return fallbackCandidate;
};

const loadGeoCache = () => {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(VISITOR_GEO_CACHE_KEY);
  if (!raw) return {};
  const parsed = safeJsonParse(raw, {});
  return parsed && typeof parsed === 'object' ? parsed : {};
};

const saveGeoCache = (cache) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VISITOR_GEO_CACHE_KEY, JSON.stringify(cache));
};

const getGeoCacheEntry = (ip) => {
  if (typeof window === 'undefined') return null;
  const cache = loadGeoCache();
  const entry = cache[ip];
  if (!entry || typeof entry !== 'object') return null;

  const updatedAt = toSafeNumber(entry.updatedAt);
  if (!updatedAt || Date.now() - updatedAt > GEO_CACHE_TTL_MS) {
    delete cache[ip];
    saveGeoCache(cache);
    return null;
  }

  return buildVisitorRecord({
    ip,
    city: entry.city,
    region: entry.region,
    country: entry.country,
    timezone: entry.timezone,
    provider: entry.provider,
    visitedAt: new Date().toISOString(),
  });
};

const setGeoCacheEntry = (visitor) => {
  if (typeof window === 'undefined' || !visitor?.ip) return;
  const cache = loadGeoCache();

  cache[visitor.ip] = {
    city: visitor.city,
    region: visitor.region,
    country: visitor.country,
    timezone: visitor.timezone,
    provider: visitor.provider,
    updatedAt: Date.now(),
  };

  const cacheEntries = Object.entries(cache).sort(
    (left, right) => toSafeNumber(right[1]?.updatedAt) - toSafeNumber(left[1]?.updatedAt),
  );
  const trimmedEntries = cacheEntries.slice(0, MAX_GEO_CACHE);

  saveGeoCache(Object.fromEntries(trimmedEntries));
};

const enrichVisitorByIp = async (visitor, signal) => {
  if (!visitor?.ip) return visitor;
  if (hasKnownVisitorMeta(visitor)) return visitor;

  const lookedUp = await fetchVisitorFromEndpoints(buildIpLookupEndpoints(visitor.ip), signal, visitor.visitedAt);
  if (lookedUp && hasKnownVisitorMeta(lookedUp)) {
    return mergeVisitors(visitor, lookedUp);
  }

  return visitor;
};

const enrichVisitorHistory = async (history, currentVisitor, signal) => {
  let changed = false;
  const nextHistory = [];

  for (const visitor of history) {
    let mergedVisitor = visitor;

    if (currentVisitor?.ip && visitor.ip === currentVisitor.ip) {
      const mergedWithCurrent = mergeVisitors(visitor, currentVisitor);
      if (!visitorsEqual(mergedWithCurrent, visitor)) {
        changed = true;
      }
      mergedVisitor = mergedWithCurrent;
    }

    const enrichedVisitor = await enrichVisitorByIp(mergedVisitor, signal);
    if (!visitorsEqual(enrichedVisitor, mergedVisitor)) {
      changed = true;
    }

    nextHistory.push(enrichedVisitor);
  }

  if (changed) {
    saveVisitorHistory(nextHistory);
  }

  return nextHistory;
};

const fetchVisitorProfile = async (signal) => {
  const visitedAt = new Date().toISOString();

  const fromCurrentEndpoints = await fetchVisitorFromEndpoints(CURRENT_VISITOR_ENDPOINTS, signal, visitedAt);
  if (fromCurrentEndpoints && hasKnownVisitorMeta(fromCurrentEndpoints)) {
    return fromCurrentEndpoints;
  }

  const ip = pickFirstText(fromCurrentEndpoints?.ip);
  if (!ip) {
    try {
      const ipPayload = await fetchJson('https://api.ipify.org?format=json', signal);
      const rawIp = pickFirstText(ipPayload?.ip);
      if (rawIp) {
        const byIp = await fetchVisitorFromEndpoints(buildIpLookupEndpoints(rawIp), signal, visitedAt);
        if (byIp) return byIp;
        return buildVisitorRecord({
          ip: rawIp,
          city: UNKNOWN_TEXT,
          region: UNKNOWN_TEXT,
          country: UNKNOWN_TEXT,
          timezone: UNKNOWN_TEXT,
          provider: UNKNOWN_TEXT,
          visitedAt,
        });
      }
    } catch {
      return fromCurrentEndpoints;
    }

    return fromCurrentEndpoints;
  }

  const fromIpLookup = await fetchVisitorFromEndpoints(buildIpLookupEndpoints(ip), signal, visitedAt);
  if (!fromIpLookup) {
    return fromCurrentEndpoints;
  }

  if (!fromCurrentEndpoints) {
    return fromIpLookup;
  }

  return mergeVisitors(fromCurrentEndpoints, fromIpLookup);
};

export const useVisitorInsights = () => {
  const [state, setState] = useState({
    viewCount: getStoredLocalViewCount(),
    viewSource: 'local',
    currentVisitor: null,
    visitorHistory: [],
    errorMessage: '',
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    clearLegacyVisitorStorage();

    const loadInsights = async () => {
      const [viewCountResult, visitorResult] = await Promise.allSettled([
        fetchViewCount(controller.signal),
        fetchVisitorProfile(controller.signal),
      ]);

      if (!mounted) return;

      const resolvedViewCount =
        viewCountResult.status === 'fulfilled' && typeof viewCountResult.value?.value === 'number'
          ? viewCountResult.value.value
          : getStoredLocalViewCount();
      const resolvedViewSource =
        viewCountResult.status === 'fulfilled' ? viewCountResult.value?.source || 'global' : 'local';

      let currentVisitor = visitorResult.status === 'fulfilled' ? visitorResult.value : null;
      if (currentVisitor) {
        currentVisitor = await enrichVisitorByIp(currentVisitor, controller.signal);
      }

      const errorMessage =
        viewCountResult.status === 'rejected' && visitorResult.status === 'rejected'
          ? 'Could not load visitor analytics right now.'
          : '';

      setState({
        viewCount: resolvedViewCount,
        viewSource: resolvedViewSource,
        currentVisitor,
        visitorHistory: [],
        errorMessage,
        isLoading: false,
      });
    };

    loadInsights();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return state;
};
