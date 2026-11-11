import { useEffect, useRef, useState } from 'react';
import { formatClock } from '../utils/dates';
import { PauseIcon, PlayIcon } from './Icons';

interface AudioPlayerProps {
  src: string;
  title: string;
  description?: string;
  expectedSeconds: number;
  initialPosition?: number;
  initialListened?: number;
  tone?: 'dark' | 'light';
  onListenedChange?: (listenedSeconds: number) => void;
  onPlay?: () => void;
  onPause?: (listenedSeconds: number) => void;
  onEnded?: (listenedSeconds: number) => void;
}

// Lecteur HTML5 tactile. Il mesure le temps réellement écouté :
// seule la lecture continue est comptée, pas les sauts dans la barre de progression.
export default function AudioPlayer({
  src,
  title,
  description,
  expectedSeconds,
  initialPosition = 0,
  initialListened = 0,
  tone = 'dark',
  onListenedChange,
  onPlay,
  onPause,
  onEnded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const listened = useRef(initialListened);
  const lastTime = useRef(initialPosition);
  const lastReported = useRef(0);
  const callbacks = useRef({ onListenedChange, onPlay, onPause, onEnded });
  callbacks.current = { onListenedChange, onPlay, onPause, onEnded };

  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [current, setCurrent] = useState(initialPosition);
  const [duration, setDuration] = useState(expectedSeconds);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    listened.current = initialListened;
    lastTime.current = initialPosition;
    setError(null);

    const onLoaded = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) setDuration(el.duration);
      if (initialPosition > 0 && initialPosition < el.duration - 2) el.currentTime = initialPosition;
    };
    const onTime = () => {
      const t = el.currentTime;
      const delta = t - lastTime.current;
      if (!el.seeking && delta > 0 && delta < 1.5) {
        listened.current += delta;
      }
      lastTime.current = t;
      setCurrent(t);
      if (Math.abs(listened.current - lastReported.current) >= 1) {
        lastReported.current = listened.current;
        callbacks.current.onListenedChange?.(listened.current);
      }
    };
    const onSeeked = () => {
      lastTime.current = el.currentTime;
    };
    const onPlayEv = () => {
      setPlaying(true);
      callbacks.current.onPlay?.();
    };
    const onPauseEv = () => {
      setPlaying(false);
      if (!el.ended) callbacks.current.onPause?.(listened.current);
    };
    const onEndedEv = () => {
      setPlaying(false);
      callbacks.current.onListenedChange?.(listened.current);
      callbacks.current.onEnded?.(listened.current);
    };
    const onWaiting = () => setBuffering(true);
    const onCanPlay = () => setBuffering(false);
    const onError = () => {
      setPlaying(false);
      setBuffering(false);
      setError('L’audio n’a pas pu être chargé. Vérifiez votre connexion, puis réessayez.');
    };

    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('seeked', onSeeked);
    el.addEventListener('play', onPlayEv);
    el.addEventListener('pause', onPauseEv);
    el.addEventListener('ended', onEndedEv);
    el.addEventListener('waiting', onWaiting);
    el.addEventListener('playing', onCanPlay);
    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('seeked', onSeeked);
      el.removeEventListener('play', onPlayEv);
      el.removeEventListener('pause', onPauseEv);
      el.removeEventListener('ended', onEndedEv);
      el.removeEventListener('waiting', onWaiting);
      el.removeEventListener('playing', onCanPlay);
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onError);
      el.pause();
    };
    // Réinitialisé seulement quand l'audio change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Titre sur l'écran verrouillé du téléphone, quand le navigateur le permet.
  useEffect(() => {
    if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: 'Présence' });
    }
  }, [title]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      setError(null);
      try {
        if (el.error) el.load();
        await el.play();
      } catch {
        setError('La lecture n’a pas pu démarrer. Touchez à nouveau le bouton lecture.');
      }
    } else {
      el.pause();
    }
  };

  const seek = (value: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    lastTime.current = value;
    setCurrent(value);
  };

  const dark = tone === 'dark';
  const remaining = Math.max(0, duration - current);
  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className={`rounded-carte p-5 ${dark ? 'bg-vert text-white' : 'bg-surface text-encre'}`}>
      <audio ref={audioRef} src={src} preload="metadata" playsInline />
      <p className={`text-mini ${dark ? 'text-white/75' : 'text-encre/60'}`}>Centrage · {formatClock(duration)}</p>
      <h2 className="mt-1 font-titre text-carte">{title}</h2>
      {description && <p className={`mt-2 text-mini ${dark ? 'text-white/80' : 'text-encre/70'}`}>{description}</p>}

      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Mettre en pause' : 'Lancer la lecture'}
          className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full transition active:scale-95 ${dark ? 'bg-white text-vert' : 'bg-vert text-white'}`}
        >
          {buffering && playing ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-current/30 border-t-current" />
          ) : playing ? (
            <PauseIcon />
          ) : (
            <PlayIcon className="ml-1" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Position dans l’audio"
            className="h-8 w-full cursor-pointer appearance-none bg-transparent"
            style={{
              background: `linear-gradient(to right, ${dark ? '#FFFFFF' : '#506662'} ${pct}%, ${dark ? 'rgba(255,255,255,0.25)' : 'rgba(47,51,36,0.15)'} ${pct}%)`,
              borderRadius: 999,
              height: 6,
            }}
          />
          <div className={`mt-2 flex justify-between text-mini tabular-nums ${dark ? 'text-white/80' : 'text-encre/60'}`}>
            <span>{formatClock(current)}</span>
            <span>-{formatClock(remaining)}</span>
          </div>
        </div>
      </div>
      {error && <p className={`mt-4 rounded-xl px-3 py-2 text-mini ${dark ? 'bg-white/15' : 'bg-sos/10'}`} role="alert">{error}</p>}
    </div>
  );
}
