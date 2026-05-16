const choiceLetters = ["①", "②", "③", "④"];

const Section = ({ title, children }) => (
  <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
    <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>
    <div className="mt-2 text-sm leading-7 text-slate-700">{children}</div>
  </div>
);

const StudyPanel = ({ question, selectedAnswer }) => {
  if (!question || selectedAnswer === null || selectedAnswer === undefined) {
    return null;
  }

  const choices = Array.isArray(question.choices) ? question.choices : [];
  const correctAnswerIndex = Number.isInteger(question.answer) ? question.answer : -1;
  const isCorrect = selectedAnswer === correctAnswerIndex;
  const correctChoice = choices[correctAnswerIndex] ?? "정답 정보가 아직 등록되지 않았습니다.";
  const correctLabel = choiceLetters[correctAnswerIndex] ?? `${correctAnswerIndex + 1}번`;
  const relatedConcepts = Array.isArray(question.relatedConcepts)
    ? question.relatedConcepts
    : [];
  const choiceExplanations = Array.isArray(question.wrongChoiceExplanations)
    ? question.wrongChoiceExplanations
    : [];

  return (
    <section className="space-y-3">
      <div
        className={`rounded-lg p-4 shadow-soft ${
          isCorrect ? "bg-teal-700 text-white" : "bg-rose-700 text-white"
        }`}
      >
        <p className="text-sm font-bold opacity-90">해설 표시</p>
        <h2 className="mt-1 text-xl font-extrabold">
          {isCorrect ? "정답입니다!" : "오답입니다."}
        </h2>
        <p className="mt-2 text-sm leading-6 opacity-95">
          정답: {correctLabel} {correctChoice}
        </p>
      </div>

      <div className="space-y-3">
        <Section title="해설">
          <p>{question.explanation || "해설이 아직 등록되지 않았습니다."}</p>
        </Section>

        <Section title="개념 정리">
          <p>{question.concept || "개념 설명이 아직 등록되지 않았습니다."}</p>
        </Section>

        <Section title="선지별 분석">
          <div className="space-y-2">
            {choices.map((choice, index) => {
              const isCorrectChoice = index === correctAnswerIndex;
              const isSelected = index === selectedAnswer;

              return (
                <div
                  key={choice}
                  className={`border-t p-3 first:border-t-0 ${
                    isCorrectChoice
                      ? "border-teal-200 bg-teal-50"
                      : isSelected
                        ? "border-rose-200 bg-rose-50"
                        : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-950">
                      {choiceLetters[index] ?? `${index + 1}번`}
                    </span>
                    {isCorrectChoice && (
                      <span className="rounded-full bg-teal-600 px-2 py-0.5 text-xs font-bold text-white">
                        정답
                      </span>
                    )}
                    {isSelected && !isCorrectChoice && (
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                        선택
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-semibold text-slate-800">{choice}</p>
                  <p className="mt-1 text-slate-600">
                    {choiceExplanations[index] || "선지 해설이 아직 등록되지 않았습니다."}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="암기 팁">
          <p>{question.memoryTip || "암기 팁이 아직 등록되지 않았습니다."}</p>
        </Section>

        <Section title="관련 개념">
          {relatedConcepts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {relatedConcepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                >
                  {concept}
                </span>
              ))}
            </div>
          ) : (
            <p>관련 개념이 아직 등록되지 않았습니다.</p>
          )}
        </Section>
      </div>
    </section>
  );
};

export default StudyPanel;
