import { useEffect, useState, type FormEvent } from 'react';
import { updateProfile } from '../services/profile';
import { toMessage } from '../services/errors';
import { remindersAreDelivered } from '../services/notifications';
import type { Profile } from '../types';
import { userTimezone } from '../utils/dates';

interface Props {
  profile: Profile;
  onSaved: (p: Profile) => void;
}

export default function ProfileSettings({ profile, onSaved }: Props) {
  const [firstName, setFirstName] = useState(profile.first_name ?? '');
  const [time, setTime] = useState(profile.reminder_time?.slice(0, 5) ?? '08:00');
  const [enabled, setEnabled] = useState(Boolean(profile.reminder_time));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setFirstName(profile.first_name ?? '');
    setTime(profile.reminder_time?.slice(0, 5) ?? '08:00');
    setEnabled(Boolean(profile.reminder_time));
  }, [profile]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const p = await updateProfile(profile.id, {
        first_name: firstName.trim() || null,
        reminder_time: enabled ? time : null,
        timezone: userTimezone(),
      });
      onSaved(p);
      setMessage({ ok: true, text: 'Préférences enregistrées.' });
    } catch (err) {
      setMessage({ ok: false, text: toMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-carte bg-surface p-5">
      <p className="surtitre">Préférences</p>
      <label className="mt-4 block text-mini text-encre/70" htmlFor="first_name">Prénom</label>
      <input id="first_name" className="champ mt-1" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />

      <div className="mt-5 flex items-center justify-between gap-4">
        <label htmlFor="reminder_enabled" className="text-corps">Rappel quotidien</label>
        <input id="reminder_enabled" type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-6 w-6 accent-[#506662]" />
      </div>
      {enabled && (
        <>
          <label className="mt-3 block text-mini text-encre/70" htmlFor="reminder_time">Heure du rappel</label>
          <input id="reminder_time" type="time" className="champ mt-1" value={time} onChange={(e) => setTime(e.target.value)} required />
          <p className="mt-2 text-mini text-encre/55">Fuseau horaire : {userTimezone()}</p>
          {!remindersAreDelivered() && (
            <p className="mt-2 text-mini text-encre/55">
              Votre heure est enregistrée. L’envoi des rappels (notification ou email) n’est pas encore activé.
            </p>
          )}
        </>
      )}

      {message && <p className={`mt-4 text-mini ${message.ok ? 'text-vert' : 'text-sos'}`} role="status">{message.text}</p>}
      <button type="submit" className="btn-vert mt-5 w-full" disabled={saving}>
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  );
}
