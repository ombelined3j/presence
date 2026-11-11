export default function DiagnosticProgress({ current, total }: { current: number; total: number }) {
  return (
    <div aria-label={`Question ${current} sur ${total}`}>
      <div className="flex items-center justify-between text-mini text-encre/60">
        <span>Question {current} sur {total}</span>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i < current ? 'bg-vert' : 'bg-encre/10'}`} />
        ))}
      </div>
    </div>
  );
}
