import type { Screen } from "./types";

const STORAGE_KEY = "iq-test-progress";
const SCHEMA_VERSION = 1;

export interface SavedProgress {
  schemaVersion: number;
  screen: Screen;
  currentIndex: number;
  answers: (number | null)[];
}

export function loadProgress(): SavedProgress | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SavedProgress;
    if (parsed.schemaVersion !== SCHEMA_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveProgress(progress: Omit<SavedProgress, "schemaVersion">): void {
  if (typeof window === "undefined") return;

  const toSave: SavedProgress = { schemaVersion: SCHEMA_VERSION, ...progress };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
