import { useEffect, useMemo, useState } from 'react';
import { integrations } from '../data/siteData';

const FALLBACK_IDS = new Set(['', 'YOUR_DISCORD_USER_ID', 'YOUR_DISCORD_ID']);
const DISCORD_STATES = new Set(['online', 'idle', 'dnd', 'offline']);
const MEDIA_SOURCES = ['youtube', 'soundcloud', 'spotify'];
const DISCORD_POLL_INTERVAL_MS = 1800;
const REQUEST_TIMEOUT_MS = 2600;
const SOCKET_RETRY_DELAY_MS = 1200;
const DEFAULT_SOCKET_HEARTBEAT_MS = 30000;
const LANYARD_SOCKET_URL = 'wss://api.lanyard.rest/socket';

const DISCORD_USER_ID =
  (typeof import.meta !== 'undefined' ? import.meta.env.VITE_DISCORD_USER_ID : '') || integrations.discordUserId || '';

const getBrowserStatus = () => {
  if (typeof window === 'undefined') return 'offline';
  return window.navigator.onLine ? 'online' : 'offline';
};

const getLanyardUserUrl = (userId) => `https://api.lanyard.rest/v1/users/${userId}?_=${Date.now()}`;

const normalizeTimestamp = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return null;
  return value < 1e12 ? value * 1000 : value;
};

const getActivityStartTimestamp = (activity) => {
  const start = normalizeTimestamp(activity?.timestamps?.start);
  if (start) return start;

  // Some activities expose only created_at; use it as a fallback for elapsed time.
  return normalizeTimestamp(activity?.created_at);
};

const getActivityEndTimestamp = (activity) => {
  return normalizeTimestamp(activity?.timestamps?.end);
};

const isExpiredActivity = (activity, nowMs = Date.now()) => {
  const endTimestamp = getActivityEndTimestamp(activity);
  if (!endTimestamp) return false;
  return endTimestamp <= nowMs;
};

const getSpotifyStartTimestamp = (spotify) => {
  return normalizeTimestamp(spotify?.timestamps?.start);
};

const formatDuration = (startedAt, nowMs) => {
  if (!startedAt || startedAt > nowMs) return '';

  const totalSeconds = Math.floor((nowMs - startedAt) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) return `${hours}h ${paddedMinutes}m ${paddedSeconds}s`;
  if (minutes > 0) return `${minutes}m ${paddedSeconds}s`;
  return `${seconds}s`;
};

const getAppLabel = (activity) => {
  if (!activity?.name) return '';

  if (activity.type === 0) return `Game/App: ${activity.name}`;
  if (activity.type === 1) return `Streaming App: ${activity.name}`;
  if (activity.type === 2 || activity.type === 3) return `Media App: ${activity.name}`;
  return `Using App: ${activity.name}`;
};

const getActivitySearchText = (activity) => {
  const searchParts = [
    activity?.name,
    activity?.details,
    activity?.state,
    activity?.assets?.large_text,
    activity?.assets?.small_text,
  ];

  return searchParts
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .toLowerCase();
};

const getMediaSource = (activity) => {
  const activityText = getActivitySearchText(activity);
  if (!activityText) return '';
  if (activityText.includes('soundcloud')) return 'SoundCloud';
  if (activityText.includes('youtube')) return 'YouTube';
  if (activityText.includes('spotify')) return 'Spotify';
  return '';
};

const isMediaActivity = (activity) => MEDIA_SOURCES.some((source) => getActivitySearchText(activity).includes(source));

const cleanMediaField = (value, sourceName) => {
  if (typeof value !== 'string') return '';

  const sourcePattern = new RegExp(`^${sourceName}\\s*[-:]\\s*`, 'i');
  return value
    .replace(/^(listening|playing|watching)\s*[:\-]\s*/i, '')
    .replace(sourcePattern, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatMediaLabel = (sourceName, activity) => {
  const title = cleanMediaField(activity?.details?.trim() || activity?.assets?.large_text?.trim(), sourceName);
  const subtitle = cleanMediaField(activity?.state?.trim() || activity?.assets?.small_text?.trim(), sourceName);

  if (title) return `${sourceName}: ${title}`;
  if (subtitle) return `${sourceName}: ${subtitle}`;
  return `${sourceName}: Active`;
};

const getSpotifyLabel = (spotify) => {
  const song = spotify?.song?.trim();
  const artist = spotify?.artist?.trim();
  if (!song && !artist) return '';
  if (song && artist) return `Spotify: ${song} - ${artist}`;
  if (song) return `Spotify: ${song}`;
  return `Spotify: ${artist}`;
};

const getMediaMeta = (presenceData, activities) => {
  const mediaActivity = activities.find((activity) => MEDIA_SOURCES.some((source) => getActivitySearchText(activity).includes(source)));

  if (mediaActivity) {
    const sourceName = getMediaSource(mediaActivity);
    if (sourceName) {
      return {
        label: formatMediaLabel(sourceName, mediaActivity),
        startedAt: getActivityStartTimestamp(mediaActivity),
        activity: mediaActivity,
      };
    }
  }

  if (presenceData?.listening_to_spotify) {
    return {
      label: getSpotifyLabel(presenceData?.spotify),
      startedAt: getSpotifyStartTimestamp(presenceData?.spotify),
      activity: null,
    };
  }

  return {
    label: '',
    startedAt: null,
    activity: null,
  };
};

const getCustomStatusLabel = (activities) => {
  const customActivity = activities.find((activity) => activity?.type === 4 && typeof activity.state === 'string');
  const customText = customActivity?.state?.trim();
  if (!customText) return '';
  return `Custom: ${customText}`;
};

const extractPresenceMeta = (presenceData) => {
  const activities = Array.isArray(presenceData?.activities) ? presenceData.activities : [];
  const richActivities = activities.filter((activity) => activity?.type !== 4 && !isExpiredActivity(activity));

  const appActivity = richActivities.find((activity) => !isMediaActivity(activity)) || null;
  const mediaMeta = getMediaMeta(presenceData, richActivities);
  const mediaLabel = mediaMeta.label;
  const appDisplayActivity = appActivity || mediaMeta.activity;
  const appLabel = appDisplayActivity ? getAppLabel(appDisplayActivity) : presenceData?.listening_to_spotify ? 'Media App: Spotify' : '';
  const appStartedAt = appDisplayActivity ? getActivityStartTimestamp(appDisplayActivity) : null;

  return {
    appLabel,
    mediaLabel,
    customLabel: getCustomStatusLabel(activities),
    durationStartedAt: appStartedAt || mediaMeta.startedAt,
  };
};

const isPresenceObject = (value) => {
  return typeof value === 'object' && value !== null && typeof value.discord_status === 'string';
};

const getSocketPresenceData = (message, targetUserId) => {
  const eventType = typeof message?.t === 'string' ? message.t : '';
  if (eventType !== 'INIT_STATE' && eventType !== 'PRESENCE_UPDATE') return null;
  if (message?.op !== 0) return null;

  const data = message?.d;
  if (!data || typeof data !== 'object') return null;

  // Single subscription can return a direct presence object.
  if (isPresenceObject(data)) {
    if (eventType !== 'PRESENCE_UPDATE') return data;
    if (typeof data.user_id === 'string' && data.user_id !== targetUserId) return null;
    return data;
  }

  // INIT_STATE may also return a { [userId]: presence } map.
  const mappedPresence = data[targetUserId];
  if (isPresenceObject(mappedPresence)) return mappedPresence;

  return null;
};

export const useSiteStatus = () => {
  const [state, setState] = useState({
    availability: getBrowserStatus(),
    source: 'browser',
    appLabel: '',
    mediaLabel: '',
    customLabel: '',
    durationStartedAt: null,
  });
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const normalizedId = DISCORD_USER_ID.trim();
    const canUseDiscord = !FALLBACK_IDS.has(normalizedId);

    if (!canUseDiscord) {
      const syncBrowserStatus = () =>
        setState({
          availability: getBrowserStatus(),
          source: 'browser',
          appLabel: '',
          mediaLabel: '',
          customLabel: '',
          durationStartedAt: null,
        });

      window.addEventListener('online', syncBrowserStatus);
      window.addEventListener('offline', syncBrowserStatus);

      return () => {
        window.removeEventListener('online', syncBrowserStatus);
        window.removeEventListener('offline', syncBrowserStatus);
      };
    }

    let isMounted = true;
    let intervalId;
    let reconnectTimeoutId;
    let heartbeatIntervalId;
    let socket;
    let stopPolling = () => {};
    let stopSocket = () => {};
    let isSyncing = false;

    const applyDiscordPresence = (presenceData) => {
      const discordStatus = presenceData?.discord_status;
      if (typeof discordStatus !== 'string' || !DISCORD_STATES.has(discordStatus)) {
        throw new Error('Invalid Lanyard payload');
      }

      const shouldShowActivities = discordStatus === 'online' || discordStatus === 'idle' || discordStatus === 'dnd';
      const { appLabel, mediaLabel, customLabel, durationStartedAt } = shouldShowActivities
        ? extractPresenceMeta(presenceData)
        : {
            appLabel: '',
            mediaLabel: '',
            customLabel: '',
            durationStartedAt: null,
          };

      if (!isMounted) return;
      setState({
        availability: discordStatus,
        source: 'discord',
        appLabel,
        mediaLabel,
        customLabel,
        durationStartedAt,
      });
    };

    const clearReconnectTimeout = () => {
      if (reconnectTimeoutId) {
        window.clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = undefined;
      }
    };

    const clearHeartbeatInterval = () => {
      if (heartbeatIntervalId) {
        window.clearInterval(heartbeatIntervalId);
        heartbeatIntervalId = undefined;
      }
    };

    const sendSocketPayload = (payload) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;
      socket.send(JSON.stringify(payload));
    };

    function scheduleSocketReconnect() {
      if (!isMounted || reconnectTimeoutId) return;

      reconnectTimeoutId = window.setTimeout(() => {
        reconnectTimeoutId = undefined;
        connectSocket();
        syncDiscordStatus();
      }, SOCKET_RETRY_DELAY_MS);
    }

    function handleSocketMessage(rawMessage) {
      let message;
      try {
        message = JSON.parse(rawMessage);
      } catch {
        return;
      }

      if (message?.op === 1) {
        const heartbeatMs =
          typeof message?.d?.heartbeat_interval === 'number' && message.d.heartbeat_interval > 1000
            ? message.d.heartbeat_interval
            : DEFAULT_SOCKET_HEARTBEAT_MS;

        sendSocketPayload({
          op: 2,
          d: { subscribe_to_id: normalizedId },
        });

        clearHeartbeatInterval();
        heartbeatIntervalId = window.setInterval(() => {
          sendSocketPayload({ op: 3 });
        }, heartbeatMs);
        return;
      }

      const presenceData = getSocketPresenceData(message, normalizedId);
      if (!presenceData) return;

      try {
        applyDiscordPresence(presenceData);
      } catch {
        // Ignore malformed socket packets; polling fallback will recover state.
      }
    }

    function connectSocket() {
      if (!isMounted || socket || typeof window === 'undefined' || typeof window.WebSocket === 'undefined') return;

      try {
        socket = new window.WebSocket(LANYARD_SOCKET_URL);
      } catch {
        scheduleSocketReconnect();
        return;
      }

      socket.onopen = () => {
        clearReconnectTimeout();
        syncDiscordStatus();
      };

      socket.onmessage = (event) => {
        handleSocketMessage(event.data);
      };

      socket.onerror = () => {};

      socket.onclose = () => {
        clearHeartbeatInterval();
        socket = undefined;
        scheduleSocketReconnect();
      };
    }

    const teardownSocket = () => {
      clearReconnectTimeout();
      clearHeartbeatInterval();

      if (!socket) return;
      const activeSocket = socket;

      if (activeSocket.readyState === WebSocket.CONNECTING) {
        // In React dev strict mode, cleanup can run before WS handshake finishes.
        // Closing a CONNECTING socket logs noisy browser warnings.
        activeSocket.onmessage = null;
        activeSocket.onerror = null;
        activeSocket.onclose = null;
        activeSocket.onopen = () => {
          activeSocket.close();
        };
      } else {
        activeSocket.onopen = null;
        activeSocket.onmessage = null;
        activeSocket.onerror = null;
        activeSocket.onclose = null;

        if (activeSocket.readyState === WebSocket.OPEN) {
          activeSocket.close();
        }
      }
      socket = undefined;
    };

    const syncDiscordStatus = async () => {
      if (isSyncing) return;
      isSyncing = true;

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(getLanyardUserUrl(normalizedId), {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (response.status === 404) {
          if (!isMounted) return;
          setState({
            availability: 'not_linked',
            source: 'discord',
            appLabel: '',
            mediaLabel: '',
            customLabel: '',
            durationStartedAt: null,
          });
          stopPolling();
          stopSocket();
          return;
        }

        if (!response.ok) {
          throw new Error(`Lanyard status ${response.status}`);
        }

        const payload = await response.json();
        applyDiscordPresence(payload?.data);
      } catch {
        if (!isMounted) return;
        setState({
          availability: window.navigator.onLine ? 'unavailable' : 'offline',
          source: 'discord',
          appLabel: '',
          mediaLabel: '',
          customLabel: '',
          durationStartedAt: null,
        });
      } finally {
        window.clearTimeout(timeoutId);
        isSyncing = false;
      }
    };

    stopPolling = () => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    stopSocket = () => {
      teardownSocket();
    };

    syncDiscordStatus();
    connectSocket();
    intervalId = window.setInterval(syncDiscordStatus, DISCORD_POLL_INTERVAL_MS);
    const handleWindowFocus = () => syncDiscordStatus();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncDiscordStatus();
      }
    };
    const handleConnectionChange = () => syncDiscordStatus();

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      isMounted = false;
      stopPolling();
      stopSocket();
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  return useMemo(() => {
    const duration = formatDuration(state.durationStartedAt, nowMs);
    const durationLabel = duration ? `Active: ${duration}` : '';

    if (state.source === 'browser') {
      const browserOnline = state.availability === 'online';
      return {
        label: browserOnline ? 'Owner Online' : 'Owner Offline',
        toneClass: browserOnline ? 'text-emerald-600 dark:text-emerald-300' : 'text-zinc-600 dark:text-zinc-300',
        dotClass: browserOnline ? 'bg-emerald-500 dark:bg-emerald-300' : 'bg-zinc-500 dark:bg-zinc-300',
        appLabel: '',
        mediaLabel: '',
        customLabel: '',
        durationLabel: '',
      };
    }

    if (state.availability === 'online') {
      return {
        label: 'Owner Online (Discord)',
        toneClass: 'text-emerald-600 dark:text-emerald-300',
        dotClass: 'bg-emerald-500 dark:bg-emerald-300',
        appLabel: state.appLabel,
        mediaLabel: state.mediaLabel,
        customLabel: state.customLabel,
        durationLabel,
      };
    }

    if (state.availability === 'idle') {
      return {
        label: 'Owner Idle (Discord)',
        toneClass: 'text-amber-600 dark:text-amber-300',
        dotClass: 'bg-amber-500 dark:bg-amber-300',
        appLabel: state.appLabel,
        mediaLabel: state.mediaLabel,
        customLabel: state.customLabel,
        durationLabel,
      };
    }

    if (state.availability === 'dnd') {
      return {
        label: 'Owner Do Not Disturb',
        toneClass: 'text-rose-600 dark:text-rose-300',
        dotClass: 'bg-rose-500 dark:bg-rose-300',
        appLabel: state.appLabel,
        mediaLabel: state.mediaLabel,
        customLabel: state.customLabel,
        durationLabel,
      };
    }

    if (state.availability === 'offline') {
      return {
        label: 'Owner Offline (Discord)',
        toneClass: 'text-zinc-600 dark:text-zinc-300',
        dotClass: 'bg-zinc-500 dark:bg-zinc-300',
        appLabel: '',
        mediaLabel: '',
        customLabel: '',
        durationLabel: '',
      };
    }

    if (state.availability === 'not_linked') {
      return {
        label: 'Lanyard Not Linked',
        toneClass: 'text-orange-600 dark:text-orange-300',
        dotClass: 'bg-orange-500 dark:bg-orange-300',
        appLabel: '',
        mediaLabel: '',
        customLabel: '',
        durationLabel: '',
      };
    }

    return {
      label: 'Discord Unavailable',
      toneClass: 'text-orange-600 dark:text-orange-300',
      dotClass: 'bg-orange-500 dark:bg-orange-300',
      appLabel: '',
      mediaLabel: '',
      customLabel: '',
      durationLabel: '',
    };
  }, [state.availability, state.source, state.appLabel, state.mediaLabel, state.customLabel, state.durationStartedAt, nowMs]);
};
