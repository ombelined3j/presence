import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import { DojoIcon, FocusIcon, HomeIcon, ProfileIcon, SosIcon } from './Icons';
import { Wordmark } from './ui';

const ITEMS: { to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; end?: boolean }[] = [
  { to: '/app', label: 'Accueil', Icon: HomeIcon, end: true },
  { to: '/app/sos', label: 'SOS', Icon: SosIcon },
  { to: '/app/dojo', label: 'Dojo', Icon: DojoIcon },
  { to: '/app/focus', label: 'Focus', Icon: FocusIcon },
  { to: '/app/profil', label: 'Profil', Icon: ProfileIcon },
];

// Mobile : barre fixe en bas (pilule sombre de la maquette).
// Ordinateur (lg) : colonne latérale.
export default function BottomNavigation() {
  return (
    <>
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"
      >
        <ul className="mx-auto flex max-w-md items-center justify-between rounded-full bg-encre px-2 py-2">
          {ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                aria-label={label}
                className={({ isActive }) =>
                  `flex h-12 min-w-12 flex-col items-center justify-center rounded-full px-3 transition ${
                    isActive ? 'bg-vert text-white' : to === '/app/sos' ? 'text-sos' : 'text-fond/80'
                  }`
                }
              >
                <Icon />
                <span className="sr-only">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Navigation principale" className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-surface px-5 py-8 lg:flex">
        <Wordmark className="px-3" />
        <ul className="mt-10 flex flex-col gap-1">
          {ITEMS.map(({ to, label, Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-4 py-3 text-corps transition ${
                    isActive ? 'bg-vert text-white' : 'text-encre hover:bg-fond'
                  }`
                }
              >
                <Icon className={to === '/app/sos' ? 'text-sos' : undefined} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="mt-auto px-3 text-mini text-encre/55">Cette conversation que vous redoutez ? Préparez-vous à l’avoir.</p>
      </nav>
    </>
  );
}
