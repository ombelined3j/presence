import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckIcon } from '../components/Icons';
import { Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import bulles from '../assets/bulles.png';
import bonhommes from '../assets/bonhommes.png';
import arbreLilas from '../assets/arbre-lilas.webp';
import agnes from '../assets/agnes.webp';

// Charte v2 : sable, lilas et orange pour les cartes (texte encre), vert pour les repères
// (surtitres, mots clés, séance du jour), encre + blanc pour les appels à l'action uniquement.
// L'orange ne touche jamais le vert : ni posé dessus, ni dans un bloc voisin.

const CONSTAT = [
  { title: 'Avant', text: 'Vous cherchez vos mots, vous anticipez, vous vous mettez la pression.', bg: 'bg-sable' },
  { title: 'Pendant', text: 'Vous vous justifiez, vous vous excusez trop, ou vous réagissez à chaud.', bg: 'bg-lilas' },
  { title: 'Après', text: 'Vous ressassez ce qui a été dit, et vous vous critiquez.', bg: 'bg-orange' },
];

const STEPS = [
  {
    n: '01',
    title: 'Découvrez votre profil',
    text: '10 questions pour savoir quel réflexe prend le dessus quand un échange se tend : vous retirer, endurer, vous suradapter, vous imposer ou faire comme il faut. Gratuit, sans compte.',
  },
  {
    n: '02',
    title: 'Entraînez-vous 5 minutes chaque matin',
    text: 'Un rappel le matin, puis une séance guidée et un micro-exercice adaptés à votre profil.',
  },
  {
    n: '03',
    title: 'Préparez les conversations qui comptent',
    text: 'Choisissez la situation et recevez une séance pour clarifier ce que vous voulez, trouver votre première phrase et rester stable au moment de parler.',
  },
];

const SITUATIONS = [
  'Poser une limite',
  'Réparer le lien',
  'Oser exprimer ce qui compte',
  'Convaincre et négocier',
  'Confronter l’autre à la réalité',
  'Accueillir avec discernement',
  'Traverser les désaccords',
];

const BENEFITS = [
  { title: 'Rester stable', text: 'Garder votre calme quand une conversation se tend.' },
  { title: 'Oser dire', text: 'Poser vos limites et exprimer vos besoins sans culpabiliser.' },
  { title: 'Moins ressasser', text: 'Moins rejouer la scène après coup, et moins vous critiquer.' },
];

const OFFRE = [
  { label: 'Diagnostic gratuit', bg: 'bg-sable' },
  { label: '1 semaine de pratique offerte', bg: 'bg-lilas' },
  { label: 'Sans engagement', bg: 'bg-white' },
  { label: 'Web app, rien à télécharger', bg: 'bg-white' },
];

// Espace insécable avant « ? » et « : » (typographie française, évite un signe seul en début de ligne).
const nb = (s: string) => s.replace(/ ([?:!;])/g, ' $1');

// Mot clé en vert, sans gras (charte).
const K = ({ children }: { children: ReactNode }) => <span className="text-vert">{children}</span>;

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-20">
      <header className="flex items-center justify-between">
        <Wordmark />
        <Link to={user ? '/app' : '/connexion'} className="text-mini text-vert underline-offset-4 hover:underline">
          {user ? 'Mon espace' : 'Se connecter'}
        </Link>
      </header>

      {/* 1. Hero : promesse, CTA, puis visuel apaisant */}
      <section className="relative -mt-8">
        {/* Bulles de dialogue au-dessus du titre, à droite : elles ne touchent aucun mot. */}
        <img src={bulles} alt="" aria-hidden className="pointer-events-none ml-auto block w-28 sm:w-36" />
        <p className="surtitre mt-2">Pour managers et leaders</p>
        <h1 className="mt-3 text-[40px] leading-[1.05] sm:text-hero">
          {nb('Cette conversation que vous redoutez ?')} <K>Préparez-vous à l’avoir.</K>
        </h1>
        <p className="mt-5 text-corps text-encre/80">
          5 minutes d’entraînement par jour pour rester calme dans les échanges tendus, poser vos limites sans culpabiliser et moins ressasser après coup.
        </p>
        <CtaButton className="mt-8" />
        <p className="mt-3 text-mini text-encre/60">Gratuit, 2 minutes, sans création de compte.</p>

        <figure className="relative mt-10 overflow-hidden rounded-carte">
          <img src={arbreLilas} alt="" aria-hidden className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]" />
          <figcaption className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-mini text-encre">
            <span className="h-2 w-2 rounded-full bg-vert" aria-hidden />
            Séance du jour · 5 min
          </figcaption>
        </figure>
      </section>

      {/* 2. Le constat : les trois couleurs de cartes */}
      <section aria-labelledby="constat">
        <SectionTitle id="constat" kicker="Le constat">
          Vous avez déjà beaucoup appris. Le plus dur, c’est <K>le moment venu.</K>
        </SectionTitle>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {CONSTAT.map((c) => (
            <div key={c.title} className={`flex min-h-[148px] flex-col justify-between gap-6 rounded-carte p-5 text-encre ${c.bg}`}>
              <h3 className="font-titre text-carte">{c.title}</h3>
              <p className="text-mini">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-corps text-encre/80">
          {nb('Ce qui manque, ce n’est pas la théorie : c’est la pratique. Un entraînement régulier, quand vous voulez, où vous voulez.')}
        </p>
      </section>

      {/* 3. Comment ça marche */}
      <section aria-labelledby="comment">
        <SectionTitle id="comment" kicker="Comment ça marche">
          On commence par <K>vous connaître.</K>
        </SectionTitle>
        <ol className="mt-6 flex flex-col gap-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4 rounded-carte border border-encre/10 bg-white p-5">
              <span className="pt-0.5 font-titre text-carte font-light text-vert">{s.n}</span>
              <div>
                <h3 className="font-titre text-carte">{s.title}</h3>
                <p className="mt-1 text-mini text-encre/75">{nb(s.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Aperçu de l'accueil de l'app (éléments factices, non cliquables) */}
      <section aria-labelledby="apercu">
        <SectionTitle id="apercu" kicker="Dans l’app">
          Une séance de <K>5 minutes</K>, rien que pour vous.
        </SectionTitle>
        <div className="mt-6 select-none rounded-ecran border-[6px] border-white bg-surface p-4 shadow-[0_12px_40px_-20px_rgba(47,51,36,0.25)] sm:p-6" aria-hidden>
          <div className="relative overflow-hidden rounded-carte bg-vert p-5 text-white">
            <span className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-lilas" />
            <p className="text-mini text-white/80">Séance du jour · 5 min</p>
            <p className="mt-1 max-w-[16rem] font-titre text-carte">Rester calme quand une conversation se tend</p>
            <span className="mt-5 inline-flex cursor-default items-center gap-2 rounded-full bg-encre px-5 py-2.5 text-mini text-white">
              Commencer <ArrowUpRight />
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Tile bg="bg-sable" label="Préparer une situation" />
            <Tile bg="bg-lilas" label="Pratiquer en dojo" />
          </div>
        </div>
        <p className="mt-5 text-corps text-encre/80">
          Chaque matin, la séance du jour vous attend. Une conversation approche ? Préparez-la en quelques minutes.
        </p>
      </section>

      {/* 5. Situations */}
      <section aria-labelledby="situations">
        <SectionTitle id="situations" kicker="Pour les conversations qui comptent">
          <K>7 types de situations</K>, au travail comme dans la vie personnelle.
        </SectionTitle>
        <ul className="mt-6 flex flex-wrap gap-2">
          {SITUATIONS.map((s) => (
            <li key={s} className="rounded-full border border-encre/10 bg-white px-4 py-2.5 text-mini text-encre">{s}</li>
          ))}
        </ul>
        <p className="mt-5 text-corps text-encre/80">Vous choisissez la situation, la séance s’adapte.</p>
      </section>

      {/* 6. Ce que vous y gagnez */}
      <section aria-labelledby="gains">
        <SectionTitle id="gains" kicker="Ce que vous y gagnez">
          Rester stable, <K>même quand ça se tend.</K>
        </SectionTitle>
        <ul className="mt-6 flex flex-col divide-y divide-encre/10 rounded-carte border border-encre/10 bg-white">
          {BENEFITS.map((b) => (
            <li key={b.title} className="flex gap-4 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vert text-white" aria-hidden>
                <CheckIcon width={16} height={16} />
              </span>
              <div>
                <h3 className="font-titre text-carte">{b.title}</h3>
                <p className="mt-1 text-mini text-encre/75">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Qui vous accompagne */}
      <section aria-labelledby="agnes" className="overflow-hidden rounded-carte bg-sable sm:grid sm:grid-cols-[200px_1fr]">
        <img src={agnes} alt="Agnès" className="aspect-[4/3] w-full object-cover object-[50%_20%] sm:aspect-auto sm:h-full" />
        <div className="p-6">
          <p className="text-mini uppercase tracking-[0.14em] text-encre/70">Qui vous accompagne</p>
          <h2 id="agnes" className="mt-3 font-titre text-titre">Agnès</h2>
          <p className="mt-3 text-corps text-encre/85">
            Si une situation est trop lourde pour être préparée en quelques minutes, vous pouvez réserver une séance SOS directement avec elle.
          </p>
        </div>
      </section>

      {/* 8. L'offre */}
      <section aria-labelledby="offre">
        <SectionTitle id="offre" kicker="L’offre">
          Une offre <K>simple</K>, pour commencer en douceur.
        </SectionTitle>
        <ul className="mt-6 flex flex-wrap gap-2">
          {OFFRE.map((o) => (
            <li key={o.label} className={`rounded-full px-4 py-2.5 text-mini text-encre ${o.bg} ${o.bg === 'bg-white' ? 'border border-encre/10' : ''}`}>
              {o.label}
            </li>
          ))}
        </ul>
      </section>

      {/* 9. Appel final */}
      <section className="rounded-carte bg-surface px-6 pb-8 pt-10 text-center">
        <img src={bonhommes} alt="" aria-hidden className="mx-auto w-48 sm:w-56" />
        <h2 className="mx-auto mt-8 max-w-md font-titre text-titre">
          Commencez par <K>découvrir votre profil.</K>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-corps text-encre/80">
          {nb('Vous retirer, endurer, vous suradapter, vous imposer ou faire comme il faut : découvrez le réflexe qui prend le dessus quand un échange se tend.')}
        </p>
        <CtaButton className="mt-6 items-center" />
        <p className="mt-3 text-mini text-encre/60">Gratuit, 2 minutes, sans création de compte.</p>
      </section>
    </div>
  );
}

function SectionTitle({ id, kicker, children }: { id: string; kicker: string; children: ReactNode }) {
  return (
    <>
      <p className="surtitre">{kicker}</p>
      <h2 id={id} className="mt-3 font-titre text-titre">{children}</h2>
    </>
  );
}

function Tile({ bg, label }: { bg: string; label: string }) {
  return (
    <div className={`flex min-h-[116px] cursor-default flex-col justify-between gap-3 rounded-carte p-4 text-encre ${bg}`}>
      <span className="text-corps leading-snug">{label}</span>
      <span className="flex h-8 w-8 items-center justify-center self-end rounded-full bg-white/70"><ArrowUpRight /></span>
    </div>
  );
}

function CtaButton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row ${className.includes('items-center') ? 'sm:justify-center' : ''} ${className}`}>
      <Link to="/diagnostic" className="btn-encre">
        Découvrir mon profil <ArrowRight />
      </Link>
    </div>
  );
}
