import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar.jsx";
import ProgressSummary from "./components/ProgressSummary.jsx";
import QuizCard from "./components/QuizCard.jsx";
import StatsPanel from "./components/StatsPanel.jsx";
import StudyPanel from "./components/StudyPanel.jsx";
import questions from "./data/questions.js";
import { loadProgress, resetProgress, saveProgress } from "./utils/storage.js";
import {
  calculateStats,
  filterQuestions,
  getUniqueChapters,
  getUniqueDifficulties,
  getUniqueSections,
  getUniqueTypes,
  shuffleQuestions,
} from "./utils/quizUtils.js";

const initialFilters = {
  search: "",
  chapter: "all",
  section: "all",
  difficulty: "all",
  type: "all",
  mode: "all",
  examScope: "all",
};

const App = () => {
  const [progress, setProgress] = useState(() => loadProgress());
  const [filters, setFilters] = useState(initialFilters);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffleVersion, setShuffleVersion] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestion, setAnsweredQuestion] = useState(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const filteredQuestions = useMemo(
    () => filterQuestions(questions, filters, progress),
    [filters, progress],
  );

  const filteredQuestionIdsKey = useMemo(
    () => filteredQuestions.map((question) => question.id).join("|"),
    [filteredQuestions],
  );

  const displayedQuestions = useMemo(() => {
    if (!isShuffle) {
      return filteredQuestions;
    }

    return shuffleQuestions(filteredQuestions);
  }, [filteredQuestionIdsKey, isShuffle, shuffleVersion]);

  useEffect(() => {
    if (currentQuestionIndex >= displayedQuestions.length) {
      setCurrentQuestionIndex(Math.max(displayedQuestions.length - 1, 0));
    }
  }, [currentQuestionIndex, displayedQuestions.length]);

  const stats = useMemo(
    () => calculateStats(questions, filteredQuestions, progress),
    [filteredQuestions, progress],
  );

  const filterOptions = useMemo(
    () => ({
      chapters: getUniqueChapters(questions),
      sections: getUniqueSections(questions, filters.chapter),
      difficulties: getUniqueDifficulties(questions),
      types: getUniqueTypes(questions),
    }),
    [filters.chapter],
  );

  const resetQuestionState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestion(null);
  };

  const currentQuestion = answeredQuestion ?? displayedQuestions[currentQuestionIndex] ?? null;
  const displayedIndex = currentQuestion
    ? displayedQuestions.findIndex((question) => question.id === currentQuestion.id)
    : -1;
  const activeTotalQuestions =
    answeredQuestion && displayedIndex < 0
      ? displayedQuestions.length + 1
      : displayedQuestions.length;
  const currentPosition =
    displayedIndex >= 0
      ? displayedIndex + 1
      : Math.min(currentQuestionIndex + 1, activeTotalQuestions || 1);

  const moveToNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestion(null);

    if (displayedQuestions.length <= 1) {
      setCurrentQuestionIndex(0);
      return;
    }

    if (answeredQuestion) {
      const answeredIndex = displayedQuestions.findIndex(
        (question) => question.id === answeredQuestion.id,
      );

      if (answeredIndex >= 0) {
        setCurrentQuestionIndex((answeredIndex + 1) % displayedQuestions.length);
        return;
      }

      setCurrentQuestionIndex(Math.min(currentQuestionIndex, displayedQuestions.length - 1));
      return;
    }

    setCurrentQuestionIndex((currentQuestionIndex + 1) % displayedQuestions.length);
  };

  const handleFilterChange = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
      section: name === "chapter" ? "all" : previous.section,
    }));
    resetQuestionState();
  };

  const handleToggleShuffle = () => {
    setIsShuffle((previous) => !previous);
    setShuffleVersion((previous) => previous + 1);
    resetQuestionState();
  };

  const handleSelectAnswer = (answerIndex) => {
    if (!currentQuestion || showExplanation) {
      return;
    }

    const isCorrect = answerIndex === currentQuestion.answer;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setAnsweredQuestion(currentQuestion);

    setProgress((previous) => {
      const solvedQuestionIds = new Set(previous.solvedQuestionIds);
      const wrongQuestionIds = new Set(previous.wrongQuestionIds);
      const previousAttempt = previous.attemptsByQuestion?.[currentQuestion.id] ?? {
        total: 0,
        correct: 0,
        wrong: 0,
      };
      const nextAttempt = {
        total: previousAttempt.total + 1,
        correct: previousAttempt.correct + (isCorrect ? 1 : 0),
        wrong: previousAttempt.wrong + (isCorrect ? 0 : 1),
      };

      solvedQuestionIds.add(currentQuestion.id);

      if (!isCorrect) {
        wrongQuestionIds.add(currentQuestion.id);
      }

      return {
        totalSolved: previous.totalSolved + 1,
        correctCount: previous.correctCount + (isCorrect ? 1 : 0),
        wrongCount: previous.wrongCount + (isCorrect ? 0 : 1),
        solvedQuestionIds: [...solvedQuestionIds],
        wrongQuestionIds: [...wrongQuestionIds],
        attemptsByQuestion: {
          ...previous.attemptsByQuestion,
          [currentQuestion.id]: nextAttempt,
        },
        lastResultByQuestion: {
          ...previous.lastResultByQuestion,
          [currentQuestion.id]: {
            selectedAnswer: answerIndex,
            isCorrect,
            attemptCount: nextAttempt.total,
            answeredAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        "정말 모든 풀이 기록을 초기화할까요? 정답/오답 기록과 오답노트가 모두 삭제됩니다.",
      )
    ) {
      setProgress(resetProgress());
      resetQuestionState();
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f3ec] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <header className="pt-2">
          <p className="text-sm font-extrabold text-teal-700">군무원 시험 대비</p>
          <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950">
            영상학 객관식 퀴즈
          </h1>
        </header>

        <StatsPanel stats={stats} />
        <ProgressSummary
          progress={progress}
          totalQuestions={questions.length}
          onReset={handleResetProgress}
        />
        <FilterBar
          filters={filters}
          options={filterOptions}
          isShuffle={isShuffle}
          onFilterChange={handleFilterChange}
          onToggleShuffle={handleToggleShuffle}
        />

        <div className="flex flex-col gap-4">
          <QuizCard
            question={currentQuestion}
            currentPosition={currentPosition}
            totalQuestions={activeTotalQuestions}
            selectedAnswer={selectedAnswer}
            isAnswered={showExplanation}
            onSelectAnswer={handleSelectAnswer}
            onNext={moveToNextQuestion}
            onSkip={moveToNextQuestion}
          />
          {showExplanation && (
            <StudyPanel question={currentQuestion} selectedAnswer={selectedAnswer} />
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
