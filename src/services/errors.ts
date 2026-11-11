export function toMessage(error: unknown, fallback = 'Une erreur est survenue. Réessayez dans un instant.'): string {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    const msg = (error as { message: string }).message;
    if (/Failed to fetch|NetworkError/i.test(msg)) return 'Connexion impossible. Vérifiez votre réseau.';
    return msg;
  }
  return fallback;
}

export function authMessage(error: unknown): string {
  const raw = toMessage(error);
  if (/Invalid login credentials/i.test(raw)) return 'Email ou mot de passe incorrect.';
  if (/User already registered/i.test(raw)) return 'Un compte existe déjà avec cet email.';
  if (/Email not confirmed/i.test(raw)) return 'Votre email n’est pas encore confirmé. Consultez votre boîte de réception.';
  if (/Password should be at least/i.test(raw)) return 'Le mot de passe est trop court.';
  if (/rate limit/i.test(raw)) return 'Trop de tentatives. Patientez quelques minutes.';
  return raw;
}
