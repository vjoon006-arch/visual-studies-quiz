const STORAGE_KEY = "visual-studies-quiz-progress";

export const createEmptyProgress = () => ({
  totalSolved: 0,
  correctCount: 0,
  wrongCount: 0,
  solvedQuestionIds: [],
  wrongQuestionIds: [],
  attemptsByQuestion: {},
  lastResultByQuestion: {},
});

const normalizeAttemptMap = (attemptsByQuestion) => {
  if (!attemptsByQuestion || typeof attemptsByQuestion !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(attemptsByQuestion).map(([questionId, attempt]) => [
      questionId,
      {
        total: Number(attempt?.total) || 0,
        correct: Number(attempt?.correct) || 0,
        wrong: Number(attempt?.wrong) || 0,
      },
    ]),
  );
};

const normalizeProgress = (progress) => {
  const fallback = createEmptyProgress();

  if (!progress || typeof progress !== "object") {
    return fallback;
  }

  return {
    totalSolved: Number(progress.totalSolved) || 0,
    correctCount: Number(progress.correctCount) || 0,
    wrongCount: Number(progress.wrongCount) || 0,
    solvedQuestionIds: Array.isArray(progress.solvedQuestionIds)
      ? progress.solvedQuestionIds
      : [],
    wrongQuestionIds: Array.isArray(progress.wrongQuestionIds)
      ? progress.wrongQuestionIds
      : [],
    attemptsByQuestion: normalizeAttemptMap(progress.attemptsByQuestion),
    lastResultByQuestion:
      progress.lastResultByQuestion && typeof progress.lastResultByQuestion === "object"
        ? progress.lastResultByQuestion
        : {},
  };
};

export const loadProgress = () => {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeProgress(JSON.parse(saved)) : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
};

export const saveProgress = (progress) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
};

export const resetProgress = () => {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }

  window.localStorage.removeItem(STORAGE_KEY);
  return createEmptyProgress();
};
