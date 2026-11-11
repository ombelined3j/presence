import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ErrorBox, Wordmark } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../integrations/supabase/client';
import { authMessage } from '../services/errors';
import { Field } from './SignUpPage';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/app';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Renseignez votre email et votre mot de passe.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to="/"><Wordmark /></Link>
      <header>
        <p className="surtitre">Connexion</p>
        <h1 className="mt-2 text-titre">Bon retour <span className="text-vert">parmi nous</span>.</h1>
      </header>
      {!isSupabaseConfigured && <ErrorBox message="La connexion nécessite la configuration de Supabase." />}
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field id="email" label="Email">
          <input id="email" type="email" inputMode="email" className="champ" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </Field>
        <Field id="password" label="Mot de passe">
          <input id="password" type="password" className="champ" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        {error && <ErrorBox message={error} />}
        <button type="submit" className="btn-vert mt-2" disabled={submitting || !isSupabaseConfigured}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      <p className="text-center text-mini text-encre/70">
        Pas encore de compte ? <Link to="/diagnostic" className="text-vert underline underline-offset-4">Commencer par le diagnostic</Link>
        {' '}ou <Link to="/inscription" className="text-vert underline underline-offset-4">créer un compte</Link>.
      </p>
    </div>
  );
}
