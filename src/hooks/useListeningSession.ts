import { useCallback, useEffect, useRef, useState } from 'react';
import { findResumableSession, startSession, updateSessionStatus } from '../services/sessions';
import { toMessage } from '../services/errors';
import type { AudioExercise, DailySession, SessionSource } from '../types';

export const COMPLETION_RATIO = 0.9; // identique au contrôle côté base (validate_daily_session)

type Phase = 'loading' | 'ready' | 'completed' | 'stopped';

// Suivi d'une écoute de centrage dans daily_sessions :
// - la ligne est créée au premier appui sur lecture (pas à l'ouverture de la page) ;
// - la durée réellement écoutée est sauvegardée régulièrement ;
// - quitter la page marque la séance "interrupted" ; elle pourra être reprise le jour même ;
// - "completed" n'est possible qu'après au moins 90 % de l'écoute prévue (vérifié aussi en base).
export function useListeningSession(userId: string | undefined, audio: AudioExercise | null, source: SessionSource) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [resumeFrom, setResumeFrom] = useState(0);
  const [listened, setListened] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [nonce, setNonce] = useState(0);

  const session = useRef<DailySession | null>(null);
  const creating = useRef<Promise<DailySession> | null>(null);
  const listenedRef = useRef(0);
  const lastSaved = useRef(0);
  const finished = useRef(false);

  const required = audio ? Math.floor(audio.duration_seconds * COMPLETION_RATIO) : Infinity;
  const canComplete = listened >= required;

  // Recherche d'une séance à reprendre aujourd'hui.
  useEffect(() => {
    if (!userId || !audio) return;
    let active = true;
    finished.current = false;
    session.current = null;
    setPhase('loading');
    findResumableSession(userId, audio.id, source)
      .then((s) => {
        if (!active) return;
        if (s && s.duration_seconds >= 3) {
          session.current = s;
          listenedRef.current = s.duration_seconds;
          lastSaved.current = s.duration_seconds;
          setListened(s.duration_seconds);
          setResumeFrom(s.duration_seconds);
        } else {
          listenedRef.current = 0;
          setListened(0);
          setResumeFrom(0);
        }
        setPhase('ready');
      })
      .catch((e) => {
        if (!active) return;
        setError(toMessage(e));
        setPhase('ready');
      });
    return () => {
      active = false;
    };
  }, [userId, audio, source, nonce]);

  const ensureSession = useCallback(async () => {
    if (session.current) return session.current;
    if (!creating.current) {
      creating.current = startSession({ userId: userId!, mode: 'centering', exerciseId: audio!.id, source });
    }
    try {
      session.current = await creating.current;
      return session.current;
    } finally {
      creating.current = null;
    }
  }, [userId, audio, source]);

  const save = useCallback(async (status: 'started' | 'interrupted') => {
    const s = session.current;
    if (!s || finished.current) return;
    lastSaved.current = listenedRef.current;
    try {
      session.current = await updateSessionStatus(s.id, status, listenedRef.current);
    } catch {
      // Sauvegarde intermédiaire : une erreur réseau ponctuelle ne doit pas gêner l'écoute.
    }
  }, []);

  const onPlay = useCallback(async () => {
    setError(null);
    try {
      const s = await ensureSession();
      if (s.status === 'interrupted') await save('started');
    } catch (e) {
      setError(`La séance n’a pas pu être enregistrée : ${toMessage(e)}`);
    }
  }, [ensureSession, save]);

  const onProgress = useCallback(
    (seconds: number) => {
      listenedRef.current = seconds;
      setListened(seconds);
      if (seconds - lastSaved.current >= 15) void save('started');
    },
    [save],
  );

  const onPause = useCallback(() => void save('started'), [save]);

  const complete = useCallback(async () => {
    const s = session.current;
    if (!s) return;
    setBusy(true);
    setError(null);
    try {
      session.current = await updateSessionStatus(s.id, 'completed', listenedRef.current);
      finished.current = true;
      setPhase('completed');
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const stop = useCallback(async () => {
    setBusy(true);
    await save('interrupted');
    finished.current = true;
    setBusy(false);
    setPhase('stopped');
  }, [save]);

  // Sortie de page ou fermeture de l'onglet : séance interrompue (reprenable aujourd'hui).
  useEffect(() => {
    const onHide = () => void save('interrupted');
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      void save('interrupted');
    };
  }, [save]);

  // Reprendre après "Arrêter pour l'instant".
  const resume = useCallback(() => setNonce((n) => n + 1), []);

  return { resume, phase, resumeFrom, listened, required, canComplete, error, busy, onPlay, onProgress, onPause, complete, stop };
}
