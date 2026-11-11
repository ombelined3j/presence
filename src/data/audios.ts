// Durées mesurées sur les fichiers réels (ffprobe), arrondies.
// Source unique des cinq audios d’ancrage fournis. Sert de seed pour audio_exercises.
// En production, la bibliothèque se gère depuis la base (page /admin), pas depuis ce fichier.

export interface AudioSeed {
  key: string;
  title: string;
  description: string;
  audio_url: string;
  duration_seconds: number;
  position: number;
}

export const AUDIO_SEED: AudioSeed[] = [
  {
    key: 'scan',
    title: 'Scan corporel',
    description: 'Parcourir le corps, de la tête aux pieds, pour revenir dans l’instant avant la journée.',
    audio_url: 'https://res.cloudinary.com/ncu7idmv/video/upload/v1794424390/PQ_scan_corporel_6min30.m4a',
    duration_seconds: 391,
    position: 1,
  },
  {
    key: 'tactile',
    title: 'Tactile',
    description: 'S’ancrer par le toucher : les points de contact, la texture, la température.',
    audio_url: 'https://res.cloudinary.com/ncu7idmv/video/upload/v1794424384/PQ_tactile_2min30.m4a',
    duration_seconds: 150,
    position: 2,
  },
  {
    key: 'sonore',
    title: 'Sonore',
    description: 'Accueillir les sons autour de vous, sans les juger, pour calmer le mental.',
    audio_url: 'https://res.cloudinary.com/ncu7idmv/video/upload/v1794424384/PQ_sonore_2min30.m4a',
    duration_seconds: 157,
    position: 3,
  },
  {
    key: 'respi',
    title: 'Sensations respiratoires',
    description: 'Suivre le souffle tel qu’il est, pour retrouver un rythme plus posé.',
    audio_url: 'https://res.cloudinary.com/ncu7idmv/video/upload/v1794424384/PQ_sensations_respi_2min30.m4a',
    duration_seconds: 161,
    position: 4,
  },
  {
    key: 'visuel',
    title: 'Visuel',
    description: 'Poser le regard, observer ce qui est là, et laisser l’attention se stabiliser.',
    audio_url: 'https://res.cloudinary.com/ncu7idmv/video/upload/v1794424383/PQ_visuel_2min30.m4a',
    duration_seconds: 164,
    position: 5,
  },
];
