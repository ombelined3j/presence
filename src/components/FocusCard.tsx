import { Link } from 'react-router-dom';
import { ArrowBadge } from './ui';

interface Props {
  to: string;
  kicker?: string;
  title: string;
  text?: string;
  color?: 'sable' | 'lilas' | 'surface' | 'vert';
}

const COLORS = {
  sable: 'bg-sable text-encre',
  lilas: 'bg-lilas text-encre',
  surface: 'bg-surface text-encre',
  vert: 'bg-vert text-white',
};

export default function FocusCard({ to, kicker, title, text, color = 'sable' }: Props) {
  return (
    <Link to={to} className={`flex min-h-[132px] flex-col justify-between gap-3 rounded-carte p-4 transition active:scale-[0.98] ${COLORS[color]}`}>
      <div>
        {kicker && <p className={`text-mini ${color === 'vert' ? 'text-white/75' : 'text-encre/70'}`}>{kicker}</p>}
        <p className="font-titre text-[19px] leading-snug">{title}</p>
        {text && <p className={`mt-1 text-mini ${color === 'vert' ? 'text-white/80' : 'text-encre/75'}`}>{text}</p>}
      </div>
      <div className="flex justify-end">
        <ArrowBadge tone={color === 'vert' ? 'dark' : 'light'} />
      </div>
    </Link>
  );
}
