import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from '../components/Icons';
import { Disclaimer, Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { n: '1', title: 'Un mini-diagnostic', text: 'Cinq questions pour repérer vos réflexes face aux situations tendues. Gratuit, sans compte.' },
  { n: '2', title: 'Une séance par jour', text: 'Environ 5 minutes le matin, depuis votre téléphone, pour vous ancrer avant la journée.' },
  { n: '3', title: 'Une préparation quand il le faut', text: 'Une conversation vous préoccupe ? Préparez ce que vous voulez dire, et comment écouter.' },
];

const BENEFITS = [
  { title: 'Rester stable', text: 'Retrouver votre calme quand une conversation se tend.', color: 'bg-sable' },
  { title: 'Oser dire', text: 'Poser vos limites et exprimer vos besoins sans culpabiliser.', color: 'bg-lilas' },
  { title: 'Moins ressasser', text: 'Préparer en amont pour moins rejouer la scène après coup.', color: 'bg-surface' },
];

export default function LandingPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-14">
      <header className="flex items-center justify-between">
        <Wordmark />
        <Link to={user ? '/app' : '/connexion'} className="text-mini text-vert underline-offset-4 hover:underline">
          {user ? 'Mon espace' : 'Se connecter'}
        </Link>
      </header>

      <section>
        {/* Ronds décoratifs dans leur propre zone, au-dessus du texte : ils ne touchent jamais un mot. */}
        <div className="relative mb-2 h-20" aria-hidden>
          <span className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full bg-sable" />
          <span className="pointer-events-none absolute right-16 top-1 h-10 w-10 rounded-full bg-lilas" />
        </div>
        <p className="surtitre">Pour managers et leaders</p>
        <h1 className="mt-3 text-[40px] leading-[1.05] sm:text-hero">
          Cette conversation que vous redoutez ? <span className="text-vert">Préparez-vous à l’avoir.</span>
        </h1>
        <p className="mt-5 text-corps text-encre/80">
          5 minutes d’entraînement par jour pour rester calme dans les échanges tendus et poser vos limites sans culpabiliser, jusqu’à en faire un réflexe. Commencez par découvrir votre profil.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row">
          <Link to="/diagnostic" className="btn-vert">
            Découvrir mon profil <ArrowRight />
          </Link>
        </div>
        <p className="mt-3 text-mini text-encre/60">Gratuit, 2 minutes, sans création de compte.</p>
      </section>

      <section className="relative overflow-hidden rounded-carte bg-vert p-6 text-white">
        <span className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-lilas" aria-hidden />
        <p className="text-mini text-white/75">Séance du jour · 5 min</p>
        <h2 className="mt-1 font-titre text-[26px] leading-tight">Une séance de 5 minutes, rien que pour vous.</h2>
        <p className="mt-3 text-corps text-white/85">
          Chaque matin, un exercice audio de centrage : le corps, le souffle, les sons. Ou, si une conversation approche, une préparation guidée pour clarifier ce que vous ressentez et ce que vous voulez dire.
        </p>
      </section>

      <section>
        <p className="surtitre">Comment ça marche</p>
        <ol className="mt-4 flex flex-col gap-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4 rounded-carte bg-surface p-5">
              <span className="font-titre text-[28px] leading-none text-vert">{s.n}</span>
              <div>
                <h3 className="font-titre text-carte">{s.title}</h3>
                <p className="mt-1 text-mini text-encre/75">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

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

      <section className="rounded-carte bg-sable p-6">
        <h2 className="font-titre text-[26px] leading-tight">Commencez par mieux vous connaître.</h2>
        <p className="mt-2 text-corps text-encre/80">Évitement, adaptation, défense, contrôle, retrait : découvrez vos réflexes et un premier exercice adapté.</p>
        <Link to="/diagnostic" className="btn-blanc mt-5">
          Faire mon diagnostic <ArrowUpRight />
        </Link>
      </section>

      <footer className="border-t border-encre/10 pt-6">
        <Disclaimer />
      </footer>
    </div>
  );
}
