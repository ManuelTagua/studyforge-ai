import { useCallback, useEffect, useState } from 'react';
import { getUsageLimitStatus, recordUsage } from '../utils/usageLimits.js';

function readLimits(actions) {
  return Object.fromEntries(actions.map((action) => [action, getUsageLimitStatus(action)]));
}

export function useUsageLimits(actions) {
  const [limits, setLimits] = useState(() => readLimits(actions));

  const refreshLimits = useCallback(() => {
    setLimits(readLimits(actions));
  }, [actions]);

  const markUsage = useCallback((action) => {
    recordUsage(action);
    refreshLimits();
  }, [refreshLimits]);

  useEffect(() => {
    window.addEventListener('focus', refreshLimits);
    window.addEventListener('storage', refreshLimits);

    return () => {
      window.removeEventListener('focus', refreshLimits);
      window.removeEventListener('storage', refreshLimits);
    };
  }, [refreshLimits]);

  useEffect(() => {
    const now = Date.now();
    const nextExpiration = Object.values(limits)
      .map((limit) => limit.availableAt)
      .filter((availableAt) => availableAt && availableAt > now)
      .sort((first, second) => first - second)[0];

    if (!nextExpiration) {
      return undefined;
    }

    const timeoutId = window.setTimeout(refreshLimits, nextExpiration - now + 100);
    return () => window.clearTimeout(timeoutId);
  }, [limits, refreshLimits]);

  return { limits, markUsage, refreshLimits };
}
