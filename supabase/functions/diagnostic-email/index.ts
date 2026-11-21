// Fonction Supabase « diagnostic-email » : envoie le résultat du diagnostic par e-mail
// et inscrit l’adresse à la newsletter, via l’API Brevo.
//
// Secrets à définir dans Supabase (Edge Functions > Secrets) :
//   BREVO_API_KEY       clé API Brevo (jamais dans le code ni dans le frontend)
//   BREVO_LIST_ID       identifiant numérique de la liste de la newsletter
//   BREVO_SENDER_EMAIL  adresse d’expédition validée dans Brevo
//   BREVO_SENDER_NAME   nom d’expéditeur (facultatif, « Présence Authentique » par défaut)
//   APP_URL             adresse de l’app (facultatif)

const PROFILS: Record<string, { label: string; description: string }> = {
  withdraw: { label: 'Me retirer', description: 'Je sors de l’échange, physiquement ou mentalement.' },
  endure: { label: 'Endurer', description: 'Je retiens ce que j’aimerais dire et j’attends que ça passe.' },
  overadapt: { label: 'Me suradapter', description: 'Je m’ajuste aux attentes de l’autre en faisant passer mes besoins au second plan.' },
  impose: { label: 'M’imposer', description: 'Je fais pression sur l’autre pour que mon point de vue l’emporte.' },
  conform: { label: 'Me conformer', description: 'Je me rassure en cherchant la règle à suivre ou la façon correcte de répondre.' },
};
const ORDRE = ['withdraw', 'endure', 'overadapt', 'impose', 'conform'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const reflexes = (v: unknown): string[] =>
  Array.isArray(v) ? [...new Set(v.filter((r): r is string => typeof r === 'string' && r in PROFILS))] : [];

function bloc(titre: string, phrase: string, keys: string[], fond: string, texte: string) {
  const items = keys
    .map((k) => `<p style="margin:10px 0 0;font-size:24px;line-height:1.2;color:${texte}">${PROFILS[k].label}</p>
      <p style="margin:4px 0 0;font-size:16px;line-height:1.5;color:${texte}">${PROFILS[k].description}</p>`)
    .join('');
  return `<div style="background:${fond};border-radius:20px;padding:24px;margin:0 0 16px">
    <p style="margin:0;font-size:14px;color:${texte};opacity:.8">${titre}</p>${items}
    <p style="margin:14px 0 0;font-size:14px;color:${texte};opacity:.85">${phrase}</p></div>`;
}

function html(principal: string[], secondaires: string[], appUrl: string) {
  const plusieurs = principal.length > 1;
  const tous = ORDRE.map(
    (k) => `<li style="margin:0 0 8px"><span style="color:#516658">${PROFILS[k].label}</span> : ${PROFILS[k].description}</li>`,
  ).join('');
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F6F1EA;font-family:Helvetica,Arial,sans-serif;color:#2F3324">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <p style="margin:0 0 24px;font-size:18px">Présence Authentique</p>
    <h1 style="margin:0 0 8px;font-size:30px;line-height:1.15;font-weight:normal">Voici vos <span style="color:#516658">réflexes</span> du moment.</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.5">Un point de départ, pas une étiquette. Vos réflexes évoluent avec la pratique.</p>
    ${bloc(
      plusieurs ? 'Vos réflexes principaux' : 'Votre réflexe principal',
      plusieurs
        ? 'Ce sont les réflexes dans lesquels vous vous reconnaissez le plus d’après vos réponses, à égalité.'
        : 'C’est le réflexe dans lequel vous vous reconnaissez le plus d’après vos réponses.',
      principal, '#516658', '#FFFFFF')}
    ${secondaires.length ? bloc(
      secondaires.length > 1 ? 'Vos réflexes secondaires' : 'Votre réflexe secondaire',
      secondaires.length > 1
        ? 'Ce sont les réflexes qui ressortent ensuite de vos réponses, à égalité.'
        : 'C’est le deuxième réflexe qui ressort de vos réponses.',
      secondaires, '#C8B5E6', '#2F3324') : ''}
    <div style="background:#FBF8F3;border-radius:20px;padding:24px;margin:0 0 24px">
      <p style="margin:0 0 12px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#516658">Les 5 réflexes relationnels</p>
      <ul style="margin:0;padding-left:18px;font-size:15px;line-height:1.5">${tous}</ul>
    </div>
    <p style="margin:0 0 28px"><a href="${appUrl}/inscription" style="display:inline-block;background:#2F3324;color:#FFFFFF;text-decoration:none;border-radius:999px;padding:14px 24px;font-size:16px">Créer mon compte pour continuer</a></p>
    <p style="margin:0;font-size:13px;line-height:1.5;color:#2F3324;opacity:.6">Ces résultats sont des pistes de travail, pas un diagnostic psychologique ou médical.<br>Vous recevez cet e-mail car vous avez fait le diagnostic gratuit de Présence Authentique et indiqué cette adresse.</p>
  </div></body></html>`;
}

async function brevo(path: string, key: string, body: unknown) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Brevo ${path} : ${res.status} ${await res.text()}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { error: 'Méthode non autorisée' });

  const key = Deno.env.get('BREVO_API_KEY');
  const sender = Deno.env.get('BREVO_SENDER_EMAIL');
  if (!key || !sender) return json(500, { error: 'Envoi non configuré' });

  let payload: { email?: unknown; principal?: unknown; secondaires?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'Requête invalide' });
  }
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const principal = reflexes(payload.principal);
  const secondaires = reflexes(payload.secondaires);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || principal.length === 0) {
    return json(400, { error: 'Données invalides' });
  }

  const listId = Number(Deno.env.get('BREVO_LIST_ID'));
  const appUrl = Deno.env.get('APP_URL') ?? 'https://presence-authentique-app.vercel.app';
  try {
    if (listId) await brevo('/contacts', key, { email, listIds: [listId], updateEnabled: true });
    await brevo('/smtp/email', key, {
      sender: { email: sender, name: Deno.env.get('BREVO_SENDER_NAME') ?? 'Présence Authentique' },
      to: [{ email }],
      subject: 'Votre résultat : vos réflexes relationnels',
      htmlContent: html(principal, secondaires, appUrl),
    });
    return json(200, { ok: true });
  } catch (e) {
    console.error(e);
    return json(502, { error: 'Envoi impossible' });
  }
});
