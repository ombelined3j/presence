import type { DiagnosticQuestion as Q } from '../types';

interface Props {
  question: Q;
  selectedId?: string;
  onSelect: (answerId: string) => void;
}

export default function DiagnosticQuestion({ question, selectedId, onSelect }: Props) {
  return (
    <fieldset>
      <legend className="font-titre text-[26px] leading-tight">{question.question}</legend>
      <div className="mt-6 flex flex-col gap-3">
        {question.answers.map((a) => {
          const active = a.id === selectedId;
          return (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(a.id)}
              className={`rounded-2xl border px-4 py-4 text-left text-corps transition ${
                active ? 'border-vert bg-vert text-white' : 'border-encre/10 bg-white text-encre hover:border-vert/40'
              }`}
            >
              {a.answer_label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
