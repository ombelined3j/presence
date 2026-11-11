import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const HomeIcon = (p: P) => (<svg {...base} {...p}><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10v9h12v-9" /></svg>);
export const SosIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /><path d="m6.4 6.4 3.3 3.3M14.3 14.3l3.3 3.3M17.6 6.4l-3.3 3.3M9.7 14.3l-3.3 3.3" /></svg>);
export const DojoIcon = (p: P) => (<svg {...base} {...p}><rect x="4.5" y="4.5" width="6" height="6" rx="1.6" /><rect x="13.5" y="4.5" width="6" height="6" rx="1.6" /><rect x="4.5" y="13.5" width="6" height="6" rx="1.6" /><rect x="13.5" y="13.5" width="6" height="6" rx="1.6" /></svg>);
export const FocusIcon = (p: P) => (<svg {...base} {...p}><path d="M3.5 12h2.5l2-4.5 3 9 2.5-6 1.5 3h5.5" /></svg>);
export const ProfileIcon = (p: P) => (<svg {...base} {...p}><circle cx="12" cy="8.5" r="3.5" /><path d="M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5" /></svg>);
export const ArrowUpRight = (p: P) => (<svg {...base} width={16} height={16} {...p}><path d="M7 17 17 7M9 7h8v8" /></svg>);
export const ArrowRight = (p: P) => (<svg {...base} width={18} height={18} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowLeft = (p: P) => (<svg {...base} width={20} height={20} {...p}><path d="M15 6l-6 6 6 6" /></svg>);
export const PlayIcon = (p: P) => (<svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor" {...p}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>);
export const PauseIcon = (p: P) => (<svg viewBox="0 0 24 24" width={28} height={28} fill="currentColor" {...p}><rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base} width={18} height={18} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
