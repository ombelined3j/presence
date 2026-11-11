import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from './Icons';

export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`font-titre text-[26px] font-light tracking-tight text-encre ${className}`}>Présence</span>;
}

export function ArrowBadge({ tone = 'light' }: { tone?: 'light' | 'dark' | 'sos' }) {
  const cls = tone === 'dark' ? 'bg-white/25 text-white' : tone === 'sos' ? 'bg-white/30 text-encre' : 'bg-white/70 text-encre';
  return (
    <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cls}`} aria-hidden>
      <ArrowUpRight />
    </span>
  );
}

export function Loader({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-encre/60" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-vert/30 border-t-vert" />
      <span className="text-mini">{label}</span>
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-sos/30 bg-white px-4 py-3 text-mini text-encre" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-vert underline underline-offset-4">
          Réessayer
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-carte border border-dashed border-encre/15 bg-surface p-6 text-center">
      <p className="font-titre text-carte">{title}</p>
      {children && <div className="mt-2 text-mini text-encre/70">{children}</div>}
    </div>
  );
}

export function PageHeader({ kicker, title, highlight, back, children }: { kicker: string; title: string; highlight?: string; back?: string; children?: ReactNode }) {
  return (
    <header className="mb-6">
      {back && (
        <Link to={back} className="mb-4 inline-flex items-center gap-1 text-mini text-encre/70">
          <ArrowLeft /> Retour
        </Link>
      )}
      <p className="surtitre">{kicker}</p>
      <h1 className="mt-2 text-titre">
        {title} {highlight && <span className="text-vert">{highlight}</span>}
      </h1>
      {children && <div className="mt-3 text-corps text-encre/75">{children}</div>}
    </header>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2.5 text-mini transition ${active ? 'border-vert bg-vert text-white' : 'border-encre/15 bg-white text-encre'}`}
    >
      {children}
    </button>
  );
}
