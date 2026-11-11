import { useEffect, useState } from 'react';

// Respiration guidée visuelle : 4 s d'inspiration, 6 s d'expiration.
// Expiration plus longue que l'inspiration : rythme souvent utilisé pour se recentrer.
const INHALE = 4;
const EXHALE = 6;

export default function BreathingGuide({ cycles = 6, onDone }: { cycles?: number; onDone: () => void }) {
  const total = cycles * (INHALE + EXHALE);
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (t >= total) onDone();
  }, [t, total, onDone]);

  const inCycle = t % (INHALE + EXHALE);
  const inhaling = inCycle < INHALE;
  const count = inhaling ? INHALE - inCycle : INHALE + EXHALE - inCycle;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full bg-lilas/60 transition-transform ease-in-out"
          style={{ transform: `scale(${inhaling ? 1 : 0.62})`, transitionDuration: `${inhaling ? INHALE : EXHALE}s` }}
          aria-hidden
        />
        <span className="absolute inset-10 rounded-full bg-vert/90" aria-hidden />
        <div className="relative text-center text-white">
          <p className="font-titre text-[26px]">{inhaling ? 'Inspirez' : 'Expirez'}</p>
          <p className="text-mini text-white/80 tabular-nums">{count}</p>
        </div>
      </div>
      <p className="text-mini text-encre/60" aria-live="polite">{inhaling ? 'Inspirez par le nez' : 'Expirez lentement'}</p>
      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-encre/10">
        <span className="block h-full bg-vert transition-all" style={{ width: `${Math.min(100, (t / total) * 100)}%` }} />
      </div>
    </div>
  );
}
