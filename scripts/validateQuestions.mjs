import questions from "../src/data/questions.js";

const errors = [];

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

questions.forEach((question, index) => {
  const label = question?.id ?? `index ${index}`;

  if (!isObject(question)) {
    errors.push(`${label}: question must be an object`);
    return;
  }

  if (!("id" in question)) {
    errors.push(`${label}: missing id`);
  }

  if (typeof question.question !== "string" || question.question.trim() === "") {
    errors.push(`${label}: question must be a non-empty string`);
  }

  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    errors.push(`${label}: choices must have exactly 4 items`);
  }

  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
    errors.push(`${label}: answer must be 0, 1, 2, or 3`);
  }

  if ("image" in question && typeof question.image !== "string") {
    errors.push(`${label}: image must be a string when present`);
  }

  if ("imageAlt" in question && typeof question.imageAlt !== "string") {
    errors.push(`${label}: imageAlt must be a string when present`);
  }

  if ("isPastExam" in question && typeof question.isPastExam !== "boolean") {
    errors.push(`${label}: isPastExam must be boolean when present`);
  }
});

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${questions.length} questions.`);
