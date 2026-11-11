import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '../components/Icons';
import { ErrorBox, Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { toMessage } from '../services/errors';
import { remindersAreDelivered } from '../services/notifications';
import { updateProfile } from '../services/profile';
import { userTimezone } from '../utils/dates';

export default function ReminderPage() {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(profile?.reminder_time?.slice(0, 5) ?? '08:00');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tz = userTimezone();

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const p = await updateProfile(user.id, { reminder_time: time, timezone: tz });
      setProfile(p);
      navigate('/app', { replace: true });
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Wordmark />
      <header className="relative">
        <span className="pointer-events-none absolute -right-8 -top-2 h-24 w-24 rounded-full bg-sable" aria-hidden />
        <p className="surtitre relative">Bienvenue{profile?.first_name ? `, ${profile.first_name}` : ''}</p>
        <h1 className="relative mt-2 text-titre">
          Un petit rendez-vous <span className="text-vert">chaque jour</span>.
        </h1>
        <p className="relative mt-4 text-corps text-encre/80">
          C’est la régularité, plus que la durée, qui transforme vos réflexes. Cinq minutes par jour suffisent. Choisissez le moment qui vous convient le mieux.
        </p>
      </header>

      <section className="rounded-carte bg-surface p-6">
        <label htmlFor="time" className="text-mini text-encre/70">Heure de votre séance</label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-encre/15 bg-white px-4 py-4 text-center font-titre text-[40px] text-vert focus:border-vert focus:outline-none"
        />
        <p className="mt-3 text-mini text-encre/55">Fuseau horaire détecté : {tz}. Modifiable à tout moment dans votre profil.</p>
        {!remindersAreDelivered() && (
          <p className="mt-2 text-mini text-encre/55">L’envoi des rappels n’est pas encore activé : votre heure est enregistrée pour le moment où il le sera.</p>
        )}
      </section>

      {error && <ErrorBox message={error} />}
      <button className="btn-vert" onClick={save} disabled={saving}>
        {saving ? 'Enregistrement…' : 'Activer mon rappel'} <ArrowUpRight />
      </button>
      <Link to="/app" className="text-center text-mini text-encre/60 underline underline-offset-4">Plus tard</Link>
    </div>
  );
}
