import { Link } from 'react-router-dom';
import { ArrowBadge } from './ui';

export default function SOSCard({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/app/sos" className="flex min-h-[132px] flex-col justify-between rounded-carte bg-sos p-4 text-encre transition active:scale-[0.98]">
      <div>
        {!compact && <p className="text-mini text-encre/80">Aide ponctuelle</p>}
        <p className="font-titre text-[19px] leading-snug">SOS conversation difficile</p>
      </div>
      <div className="flex justify-end">
        <ArrowBadge tone="sos" />
      </div>
    </Link>
  );
}
