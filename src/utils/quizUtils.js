const normalize = (value) => String(value ?? "").trim().toLowerCase();

const hasQuestionBeenSolved = (questionId, progress) =>
  progress?.solvedQuestionIds?.includes(questionId);

const hasQuestionBeenWrong = (questionId, progress) =>
  progress?.wrongQuestionIds?.includes(questionId);

export const filterQuestions = (questions, filters, progress) => {
  const search = normalize(filters.search);

  return questions.filter((question) => {
    if (filters.examScope === "past" && question.isPastExam !== true) {
      return false;
    }

    if (filters.examScope === "theory" && question.isPastExam === true) {
      return false;
    }

    if (filters.mode === "wrong" && !hasQuestionBeenWrong(question.id, progress)) {
      return false;
    }

    if (filters.mode === "unanswered" && hasQuestionBeenSolved(question.id, progress)) {
      return false;
    }

    if (filters.chapter !== "all" && question.chapter !== filters.chapter) {
      return false;
    }

    if (filters.section !== "all" && question.section !== filters.section) {
      return false;
    }

    if (filters.difficulty !== "all" && question.difficulty !== filters.difficulty) {
      return false;
    }

    if (filters.type !== "all" && question.type !== filters.type) {
      return false;
    }

    if (!search) {
      return true;
    }

    const searchableText = [
      question.chapter,
      question.section,
      question.difficulty,
      question.type,
      question.question,
      ...(question.choices ?? []),
      question.explanation,
      question.concept,
      question.memoryTip,
      question.source,
      question.examYear,
      question.examRound,
      question.examNumber,
      question.imageCaption,
      ...(question.relatedConcepts ?? []),
      ...(question.tags ?? []),
    ]
      .map(normalize)
      .join(" ");

    return searchableText.includes(search);
  });
};

export const calculateStats = (questions, filteredQuestions, progress) => {
  const totalSolved = progress?.totalSolved ?? 0;
  const correctCount = progress?.correctCount ?? 0;
  const wrongCount = progress?.wrongCount ?? 0;

  return {
    totalQuestions: questions.length,
    filteredQuestions: filteredQuestions.length,
    solvedCount: totalSolved,
    correctCount,
    wrongCount,
    accuracy: totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0,
  };
};

export const shuffleQuestions = (questions) => {
  const copy = [...questions];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

export const getUniqueChapters = (questions) =>
  [...new Set(questions.map((question) => question.chapter).filter(Boolean))];

export const getUniqueSections = (questions, chapter = "all") =>
  [
    ...new Set(
      questions
        .filter((question) => chapter === "all" || question.chapter === chapter)
        .map((question) => question.section)
        .filter(Boolean),
    ),
  ];

export const getUniqueDifficulties = (questions) =>
  [...new Set(questions.map((question) => question.difficulty).filter(Boolean))];

export const getUniqueTypes = (questions) =>
  [...new Set(questions.map((question) => question.type).filter(Boolean))];
