import type { DiagnosticComputed } from '../types';

// Conservation temporaire du résultat avant la création du compte.
const KEY = 'presence.pendingDiagnostic';

export function savePendingDiagnostic(result: DiagnosticComputed): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...result, saved_at: new Date().toISOString() }));
  } catch {
    // Stockage indisponible (navigation privée) : le résultat reste en mémoire de la page.
  }
}

export function readPendingDiagnostic(): (DiagnosticComputed & { saved_at: string }) | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingDiagnostic(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
