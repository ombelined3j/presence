import PreparationFlow from '../components/PreparationFlow';
import { PageHeader } from '../components/ui';
import type { SessionSource } from '../types';

// Séance quotidienne, mode "Préparer une situation difficile" (source daily),
// ou préparation depuis Focus (source focus).
export default function PrepareSituationPage({ source = 'daily' }: { source?: SessionSource }) {
  const back = source === 'focus' ? '/app/focus' : '/app';
  return (
    <>
      <PageHeader kicker={source === 'focus' ? 'Focus · situation difficile' : 'Séance du jour · préparation'} title="Préparez-vous" highlight="à l’avoir." back={back} />
      <PreparationFlow source={source} backTo={back} />
    </>
  );
}
