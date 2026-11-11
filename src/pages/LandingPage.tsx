import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, PlayIcon } from '../components/Icons';
import { Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import bulleBeige from '../assets/bulle-beige.png';
import bulleViolette from '../assets/bulle-violette.png';

const CONSTAT = [
  { title: 'Avant', text: 'Vous cherchez vos mots, vous anticipez, vous vous mettez la pression.' },
  { title: 'Pendant', text: 'Vous vous justifiez, vous vous excusez trop, ou vous réagissez à chaud.' },
  { title: 'Après', text: 'Vous ressassez ce qui a été dit, et vous vous critiquez.' },
];

const STEPS = [
  {
    n: '1',
    title: 'Découvrez votre profil',
    text: '7 questions pour savoir quel réflexe prend le dessus quand un échange se tend : vous retirer, endurer, vous suradapter, vous imposer ou faire comme il faut. Gratuit, sans compte.',
  },
  {
    n: '2',
    title: 'Entraînez-vous 5 minutes chaque matin',
    text: 'Un rappel le matin, puis une séance guidée et un micro-exercice adaptés à votre profil, pour rester calme et stable quand une conversation se tend.',
  },
  {
    n: '3',
    title: 'Préparez les conversations qui comptent',
    text: 'Une conversation approche ? Choisissez la situation et recevez une séance pour clarifier ce que vous voulez, trouver votre première phrase et rester stable au moment de parler.',
  },
];

const SITUATIONS = [
  'Répondre à une remarque déplacée',
  'Dire non à une demande insistante',
  'Recevoir une critique de votre manager',
  'Donner un feedback négatif à un collaborateur',
  'Demander une augmentation',
  'Exprimer une frustration gardée pour vous',
];

const BENEFITS = [
  { title: 'Rester stable', text: 'Garder votre calme quand une conversation se tend.', color: 'bg-sable' },
  { title: 'Oser dire', text: 'Poser vos limites et exprimer vos besoins sans culpabiliser.', color: 'bg-lilas' },
  { title: 'Moins ressasser', text: 'Moins rejouer la scène après coup, et moins vous critiquer.', color: 'bg-surface' },
];

const OFFRE = ['Diagnostic gratuit', '1 semaine de pratique offerte', 'Sans engagement'];

// Espace insécable avant « ? » et « : » (typographie française, évite un signe seul en début de ligne).
const nb = (s: string) => s.replace(/ ([?:!;])/g, ' $1');

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-16">
      <header className="flex items-center justify-between">
        <Wordmark />
        <Link to={user ? '/app' : '/connexion'} className="text-mini text-vert underline-offset-4 hover:underline">
          {user ? 'Mon espace' : 'Se connecter'}
        </Link>
      </header>

      {/* 1. Hero */}
      <section className="relative -mt-6 pt-24 sm:pt-32">
        {/* Bulles décoratives à droite, derrière le texte, dans la zone au-dessus du titre :
            elles ne touchent aucun mot du titre, en mobile comme en desktop. */}
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-24 w-[136px] sm:h-32 sm:w-[184px]" aria-hidden>
          <img src={bulleBeige} alt="" className="absolute bottom-1 right-0 w-24 sm:w-32" />
          <img src={bulleViolette} alt="" className="absolute left-0 top-0 w-12 sm:w-16" />
        </div>
        <div className="relative z-10">
          <p className="surtitre">Pour managers et leaders</p>
          <h1 className="mt-3 text-[40px] leading-[1.05] sm:text-hero">
            {nb('Cette conversation que vous redoutez ?')} <span className="text-vert">Préparez-vous à l’avoir.</span>
          </h1>
          {/* La version longue fait 6 lignes à 375 px : sur mobile, version courte. */}
          <p className="mt-5 text-corps text-encre/80 sm:hidden">
            5 minutes d’entraînement par jour pour rester calme dans les échanges tendus et poser vos limites sans culpabiliser, jusqu’à en faire un réflexe. Commencez par découvrir votre profil.
          </p>
          <p className="mt-5 hidden text-corps text-encre/80 sm:block">
            5 minutes d’entraînement par jour pour rester calme et stable dans les échanges tendus, poser vos limites sans culpabiliser et moins ressasser après coup, jusqu’à en faire un réflexe. Commencez par découvrir votre profil en conversation difficile.
          </p>
          <CtaButton className="btn-vert mt-8" />
          <p className="mt-3 text-mini text-encre/60">Gratuit, 2 minutes, sans création de compte.</p>
        </div>
      </section>

      {/* 2. Le constat */}
      <section aria-labelledby="constat">
        <p className="surtitre">Le constat</p>
        <h2 id="constat" className="mt-3 font-titre text-titre">
          Vous avez déjà beaucoup appris. Le plus dur, c’est le moment venu.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {CONSTAT.map((c) => (
            <div key={c.title} className="rounded-carte bg-surface p-5">
              <h3 className="font-titre text-carte text-vert">{c.title}</h3>
              <p className="mt-2 text-mini text-encre/80">{c.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-corps text-encre/80">
          {nb('Ce qui manque, ce n’est pas la théorie. C’est la pratique : un entraînement régulier, quand vous voulez, où vous voulez.')}
        </p>
      </section>

      {/* 3. Comment ça marche */}
      <section aria-labelledby="comment">
        <p id="comment" className="surtitre">Comment ça marche</p>
        <ol className="mt-4 flex flex-col gap-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4 rounded-carte bg-surface p-5">
              <span className="font-titre text-[28px] leading-none text-vert">{s.n}</span>
              <div>
                <h3 className="font-titre text-carte">{s.title}</h3>
                <p className="mt-1 text-mini text-encre/75">{nb(s.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Aperçu de l'écran « Séance du jour » */}
      <section className="relative overflow-hidden rounded-carte bg-vert p-6 text-white" aria-label="Aperçu de la séance du jour">
        <img src={bulleViolette} alt="" aria-hidden className="pointer-events-none absolute right-5 top-5 w-11" />
        <p className="text-mini text-white/75">Séance du jour · 5 min</p>
        <h2 className="mt-1 pr-14 font-titre text-[26px] leading-tight">Chaque matin, une séance pensée pour vous.</h2>
        <p className="mt-3 text-corps text-white/85">
          Une séance guidée, puis un micro-exercice lié à votre profil. À force de pratique, rester calme et dire ce qui compte devient naturel.
        </p>
        {/* Éléments factices : ils imitent l'app, ils ne sont pas cliquables. */}
        <div className="mt-6 grid select-none gap-3 sm:grid-cols-2" aria-hidden>
          <div className="flex cursor-default items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-encre">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vert text-white">
              <PlayIcon width={18} height={18} className="ml-0.5" />
            </span>
            <span className="text-corps">Ma séance du jour <span className="whitespace-nowrap">· 5 min</span></span>
          </div>
          <div className="flex cursor-default items-center justify-between gap-3 rounded-2xl bg-sable px-4 py-3.5 text-encre">
            <span className="text-corps">Préparer une situation difficile</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70"><ArrowUpRight /></span>
          </div>
        </div>
      </section>

      {/* 5. Situations */}
      <section aria-labelledby="situations">
        <p className="surtitre">Pour les conversations qui comptent</p>
        <h2 id="situations" className="mt-3 font-titre text-titre">Au travail comme dans la vie personnelle.</h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {SITUATIONS.map((s) => (
            <li key={s} className="rounded-full border border-encre/10 bg-white px-4 py-2.5 text-mini text-encre">{s}</li>
          ))}
        </ul>
        <p className="mt-5 text-corps text-encre/80">7 types de situations. Vous choisissez, la séance s’adapte.</p>
      </section>

      {/* 6. Ce que vous y gagnez */}
      <section>
        <p className="surtitre">Ce que vous y gagnez</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className={`rounded-carte p-5 ${b.color}`}>
              <h3 className="font-titre text-carte">{b.title}</h3>
              <p className="mt-1 text-mini text-encre/80">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. L'offre */}
      <section aria-labelledby="offre" className="rounded-carte bg-surface p-6">
        <h2 id="offre" className="font-titre text-[26px] leading-tight">Une offre simple, pour commencer en douceur.</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {OFFRE.map((o) => (
            <li key={o} className="flex items-center gap-3 rounded-2xl bg-fond px-4 py-3.5 text-corps">
              <span className="h-2 w-2 shrink-0 rounded-full bg-vert" aria-hidden />
              {o}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-mini text-encre/65">Web app, rien à télécharger.</p>
      </section>

      {/* 8. Appel final */}
      <section className="rounded-carte bg-sable p-6">
        <h2 className="font-titre text-[26px] leading-tight">Commencez par découvrir votre profil.</h2>
        <p className="mt-2 text-corps text-encre/80">
          {nb('Vous retirer, endurer, vous suradapter, vous imposer ou faire comme il faut : découvrez le réflexe qui prend le dessus quand un échange se tend.')}
        </p>
        <CtaButton className="btn-vert mt-5" />
        <p className="mt-3 text-mini text-encre/65">Gratuit, 2 minutes, sans création de compte.</p>
      </section>

    </div>
  );
}

function CtaButton({ className }: { className: string }) {
  return (
    <div className="flex flex-col sm:flex-row">
      <Link to="/diagnostic" className={className}>
        Découvrir mon profil <ArrowRight />
      </Link>
    </div>
  );
}
