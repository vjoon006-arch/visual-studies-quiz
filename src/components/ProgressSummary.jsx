const ProgressSummary = ({ progress, totalQuestions, onReset }) => {
  const solvedUnique = progress.solvedQuestionIds.length;
  const progressRate =
    totalQuestions > 0 ? Math.round((solvedUnique / totalQuestions) * 100) : 0;

  return (
    <section className="app-card overflow-hidden" aria-label="진도 요약">
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-bold text-slate-900">학습 진도</p>
          <p className="mt-1 text-sm text-slate-600">
            고유 문항 {solvedUnique}개 풀이 완료, 오답 경험 문항{" "}
            {progress.wrongQuestionIds.length}개
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="min-h-10 shrink-0 rounded-lg border border-rose-200 px-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 active:scale-[0.99]"
        >
          초기화
        </button>
      </div>
      <div className="h-2 bg-stone-100">
        <div
          className="h-full bg-teal-600 transition-all"
          style={{ width: `${progressRate}%` }}
        />
      </div>
    </section>
  );
};

export default ProgressSummary;
