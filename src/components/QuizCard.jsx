const choiceLetters = ["1", "2", "3", "4"];

const getChoiceClassName = ({ isAnswered, isCorrectChoice, isWrongSelected }) => {
  if (isAnswered && isCorrectChoice) {
    return "border-teal-500 bg-teal-50 text-teal-950 ring-2 ring-teal-100";
  }

  if (isAnswered && isWrongSelected) {
    return "border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-100";
  }

  return "border-stone-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/40";
};

const QuizCard = ({
  question,
  currentPosition,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
  onNext,
  onSkip,
}) => {
  if (!question) {
    return (
      <section className="app-card p-6 text-center">
        <p className="text-lg font-extrabold text-slate-950">조건에 맞는 문항이 없어요.</p>
        <p className="mt-2 text-sm text-slate-600">
          필터나 검색어를 조금 넓혀서 다시 확인해 주세요.
        </p>
      </section>
    );
  }

  const isCorrect = selectedAnswer === question.answer;

  return (
    <section className="app-card p-4 sm:p-5" aria-label="현재 문제">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pill-label">
          {currentPosition} / {totalQuestions}
        </span>
        <span className="pill-label">{question.difficulty}</span>
        <span className="pill-label">{question.type}</span>
        {isAnswered && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
              isCorrect ? "bg-teal-100 text-teal-800" : "bg-rose-100 text-rose-800"
            }`}
          >
            {isCorrect ? "정답" : "오답"}
          </span>
        )}
      </div>

      <div className="mt-4 border-l-4 border-teal-600 pl-3">
        <p className="text-xs font-bold text-slate-500">{question.chapter}</p>
        <p className="mt-1 text-xs font-bold text-slate-500">{question.section}</p>
      </div>

      <h2 className="mt-5 text-xl font-extrabold leading-relaxed text-slate-950">
        {question.question}
      </h2>

      <div className="mt-5 space-y-2.5">
        {question.choices.map((choice, index) => {
          const isCorrectChoice = index === question.answer;
          const isWrongSelected =
            selectedAnswer === index && selectedAnswer !== question.answer;

          return (
            <button
              key={choice}
              type="button"
              disabled={isAnswered}
              onClick={() => onSelectAnswer(index)}
              className={`flex min-h-16 w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-base font-bold leading-relaxed transition active:scale-[0.995] disabled:cursor-default ${getChoiceClassName(
                {
                  isAnswered,
                  isCorrectChoice,
                  isWrongSelected,
                },
              )}`}
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  isAnswered && isCorrectChoice
                    ? "bg-teal-600 text-white"
                    : isAnswered && isWrongSelected
                      ? "bg-rose-600 text-white"
                      : "bg-stone-100 text-slate-700"
                }`}
              >
                {choiceLetters[index]}
              </span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex gap-3">
        {!isAnswered && (
          <button
            type="button"
            onClick={onSkip}
            className="min-h-12 flex-1 rounded-lg border border-stone-300 bg-white px-4 text-base font-extrabold text-slate-700 transition hover:bg-stone-50 active:scale-[0.99]"
          >
            건너뛰기
          </button>
        )}
        {isAnswered && (
          <button
            type="button"
            onClick={onNext}
            className="min-h-12 flex-1 rounded-lg bg-slate-950 px-4 text-base font-extrabold text-white transition hover:bg-slate-800 active:scale-[0.99]"
          >
            다음 문제
          </button>
        )}
      </div>
    </section>
  );
};

export default QuizCard;
