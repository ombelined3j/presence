import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBox, Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../integrations/supabase/client';
import { authMessage } from '../services/errors';
import { readPendingDiagnostic } from '../utils/pendingDiagnostic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const hasPending = Boolean(readPendingDiagnostic());

  const validate = () => {
    const e: Record<string, string> = {};
    if (!EMAIL_RE.test(email.trim())) e.email = 'Saisissez une adresse email valide.';
    if (password.length < 8) e.password = 'Au moins 8 caractères.';
    if (confirm !== password) e.confirm = 'Les deux mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { needsConfirmation } = await signUp(email.trim(), password, firstName);
      if (needsConfirmation) setConfirmSent(true);
      else navigate('/bienvenue', { replace: true });
    } catch (e) {
      setServerError(authMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmSent) {
    return (
      <div className="flex flex-col gap-6">
        <Link to="/"><Wordmark /></Link>
        <p className="surtitre">Presque fini</p>
        <h1 className="text-titre">Vérifiez votre <span className="text-vert">boîte mail</span>.</h1>
        <p className="text-corps text-encre/80">
          Un lien de confirmation a été envoyé à {email}. Une fois votre adresse confirmée, connectez-vous : votre résultat de diagnostic sera associé à votre compte.
        </p>
        <Link to="/connexion" className="btn-vert">Aller à la connexion</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/"><Wordmark /></Link>
      <header>
        <p className="surtitre">Création de compte</p>
        <h1 className="mt-2 text-titre">Continuons <span className="text-vert">ensemble</span>.</h1>
        {hasPending && <p className="mt-3 text-mini text-vert">Votre résultat de diagnostic sera associé à ce compte.</p>}
      </header>

      {!isSupabaseConfigured && <ErrorBox message="La création de compte nécessite la configuration de Supabase." />}

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field id="first_name" label="Prénom (facultatif)">
          <input id="first_name" className="champ" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" type="email" inputMode="email" className="champ" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field id="password" label="Mot de passe" error={errors.password} hint="8 caractères minimum.">
          <input id="password" type="password" className="champ" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required aria-invalid={Boolean(errors.password)} />
        </Field>
        <Field id="confirm" label="Confirmation du mot de passe" error={errors.confirm}>
          <input id="confirm" type="password" className="champ" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required aria-invalid={Boolean(errors.confirm)} />
        </Field>
        {serverError && <ErrorBox message={serverError} />}
        <button type="submit" className="btn-vert mt-2" disabled={submitting || !isSupabaseConfigured}>
          {submitting ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
      <p className="text-center text-mini text-encre/70">
        Déjà un compte ? <Link to="/connexion" className="text-vert underline underline-offset-4">Se connecter</Link>
      </p>
    </div>
  );
}

export function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: JSX.Element }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-mini text-encre/70">{label}</label>
      {children}
      {error ? <p className="mt-1 text-mini text-sos">{error}</p> : hint ? <p className="mt-1 text-mini text-encre/50">{hint}</p> : null}
    </div>
  );
}
