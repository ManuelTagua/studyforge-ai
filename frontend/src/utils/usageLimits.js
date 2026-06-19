export const USAGE_ACTIONS = Object.freeze({
  PDF_IMPORT: 'pdfImport',
  SUMMARY: 'summary',
  QUIZ: 'quiz',
  FLASHCARDS: 'flashcards',
  SIMPLIFIED_EXPLANATION: 'simplifiedExplanation'
});

export const USAGE_LIMIT_STORAGE_KEYS = Object.freeze({
  [USAGE_ACTIONS.PDF_IMPORT]: 'studyforge_usage_pdf_import',
  [USAGE_ACTIONS.SUMMARY]: 'studyforge_usage_summary',
  [USAGE_ACTIONS.QUIZ]: 'studyforge_usage_quiz',
  [USAGE_ACTIONS.FLASHCARDS]: 'studyforge_usage_flashcards',
  [USAGE_ACTIONS.SIMPLIFIED_EXPLANATION]: 'studyforge_usage_simplified_explanation'
});

export const USAGE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function availableStatus() {
  return {
    isAvailable: true,
    usesRemaining: 1,
    usedAt: null,
    availableAt: null,
    remainingMs: 0
  };
}

export function getUsageLimitStatus(action, now = Date.now()) {
  const storageKey = USAGE_LIMIT_STORAGE_KEYS[action];

  if (!storageKey) {
    throw new Error(`Acción de uso desconocida: ${action}`);
  }

  const storage = getStorage();
  if (!storage) {
    return availableStatus();
  }

  try {
    const storedTimestamp = Number(storage.getItem(storageKey));
    const elapsedMs = now - storedTimestamp;

    if (!Number.isFinite(storedTimestamp) || storedTimestamp <= 0 || elapsedMs < 0 || elapsedMs >= USAGE_LIMIT_WINDOW_MS) {
      storage.removeItem(storageKey);
      return availableStatus();
    }

    return {
      isAvailable: false,
      usesRemaining: 0,
      usedAt: storedTimestamp,
      availableAt: storedTimestamp + USAGE_LIMIT_WINDOW_MS,
      remainingMs: USAGE_LIMIT_WINDOW_MS - elapsedMs
    };
  } catch {
    return availableStatus();
  }
}

export function recordUsage(action, timestamp = Date.now()) {
  const storageKey = USAGE_LIMIT_STORAGE_KEYS[action];

  if (!storageKey) {
    throw new Error(`Acción de uso desconocida: ${action}`);
  }

  try {
    getStorage()?.setItem(storageKey, String(timestamp));
  } catch {
    // Si el navegador bloquea localStorage, la acción puede continuar sin persistencia.
  }

  return getUsageLimitStatus(action, timestamp);
}

export function formatRemainingTime(remainingMs) {
  const totalMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) {
    return `${hours} h ${minutes} min`;
  }

  if (hours) {
    return `${hours} h`;
  }

  return `${totalMinutes} min`;
}
