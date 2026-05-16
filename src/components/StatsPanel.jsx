const StatItem = ({ label, value, accent }) => (
  <div className="rounded-lg border border-stone-200 bg-white px-3 py-3 shadow-soft">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className={`mt-1 text-xl font-extrabold ${accent ?? "text-slate-900"}`}>
      {value}
    </p>
  </div>
);

const StatsPanel = ({ stats }) => (
  <section aria-label="학습 통계">
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      <StatItem label="전체 문항" value={stats.totalQuestions} />
      <StatItem label="필터 결과" value={stats.filteredQuestions} />
      <StatItem label="누적 풀이" value={stats.solvedCount} />
      <StatItem label="정답" value={stats.correctCount} accent="text-teal-700" />
      <StatItem label="오답" value={stats.wrongCount} accent="text-rose-700" />
      <StatItem label="정답률" value={`${stats.accuracy}%`} accent="text-indigo-700" />
    </div>
  </section>
);

export default StatsPanel;
