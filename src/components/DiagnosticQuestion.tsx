import type { DiagnosticQuestion as Q } from '../types';

interface Props {
  question: Q;
  selectedId?: string;
  onSelect: (answerId: string) => void;
}

// Une affirmation et une échelle de 5 positions, de « pas du tout d’accord » à « totalement d’accord ».
export default function DiagnosticQuestion({ question, selectedId, onSelect }: Props) {
  const selected = question.answers.find((a) => a.id === selectedId);
  return (
    <fieldset>
      <legend className="font-titre text-[26px] leading-tight">{question.question}</legend>
      <div className="mt-8">
        <div className="relative flex items-center justify-between" role="radiogroup" aria-label="Votre degré d’accord">
          <span className="pointer-events-none absolute left-5 right-5 top-1/2 h-0.5 -translate-y-1/2 bg-encre/15" aria-hidden />
          {question.answers.map((a, i) => {
            const active = a.id === selectedId;
            const size = [44, 36, 30, 36, 44][i];
            return (
              <button
                key={a.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={a.answer_label}
                title={a.answer_label}
                onClick={() => onSelect(a.id)}
                style={{ width: size, height: size }}
                className={`relative flex shrink-0 items-center justify-center rounded-full border-2 transition ${
                  active ? 'border-vert bg-vert' : 'border-encre/25 bg-white hover:border-vert/60'
                }`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-mini text-encre/65">
          <span>Pas du tout d’accord</span>
          <span className="text-right">Totalement d’accord</span>
        </div>
        <p className="mt-5 min-h-[1.5em] text-center text-corps text-vert" aria-live="polite">
          {selected ? selected.answer_label : ''}
        </p>
      </div>
    </fieldset>
  );
}
