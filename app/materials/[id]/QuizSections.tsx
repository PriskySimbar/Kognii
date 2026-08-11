"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type Quiz = {
  questions: Question[];
};

export default function QuizSection({ content }: { content: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  async function generateQuiz() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      setQuiz(data);
      setSelectedAnswers([]);
      setSubmitted(false);
      setScore(0);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionIndex: number, optionIndex: number) {
    if (submitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;

    setSelectedAnswers(newAnswers);
  }

  function submitQuiz() {
    if (!quiz) return;

    let totalScore = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        totalScore++;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  }

  function getPercentage() {
    if (!quiz || quiz.questions.length === 0) {
      return 0;
    }

    return Math.round((score / quiz.questions.length) * 100);
  }

  function getResultMessage() {
    const percentage = getPercentage();

    if (percentage === 100) {
      return "Perfect! You completely understand this material.";
    }

    if (percentage >= 80) {
      return "Great job! You have a strong understanding of this material.";
    }

    if (percentage >= 60) {
      return "Good effort! Review the incorrect answers to strengthen your understanding.";
    }

    return "Keep learning! Review the material and try the quiz again.";
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            ✦
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">AI Quiz</h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Test your understanding of this material.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={generateQuiz}
          disabled={loading}
          className="shrink-0 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating..." : "✦ Generate Quiz"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Quiz */}
      {quiz && (
        <div className="mt-8">
          {/* Quiz information */}
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Knowledge Check
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {quiz.questions.length} questions
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
              AI Generated
            </span>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[index];
              const correctAnswer = question.answer;

              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = selectedAnswer === correctAnswer;

              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-5 transition ${
                    submitted
                      ? isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-red-500/30 bg-red-500/5"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  {/* Question */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold leading-7 text-white">
                        {question.question}
                      </p>

                      {/* Options */}
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => {
                          const selected = selectedAnswer === optionIndex;

                          const correct = correctAnswer === optionIndex;

                          let optionStyle =
                            "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:bg-slate-800";

                          if (!submitted && selected) {
                            optionStyle =
                              "border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500/30";
                          }

                          if (submitted && correct) {
                            optionStyle =
                              "border-emerald-500/50 bg-emerald-500/10 text-emerald-100";
                          }

                          if (submitted && selected && !correct) {
                            optionStyle =
                              "border-red-500/50 bg-red-500/10 text-red-100";
                          }

                          return (
                            <button
                              key={optionIndex}
                              type="button"
                              disabled={submitted}
                              onClick={() => selectAnswer(index, optionIndex)}
                              className={`group flex min-h-14 items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-default ${optionStyle}`}
                            >
                              {/* Option letter */}
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                                  submitted && correct
                                    ? "bg-emerald-500 text-white"
                                    : submitted && selected && !correct
                                      ? "bg-red-500 text-white"
                                      : selected
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                                }`}
                              >
                                {String.fromCharCode(65 + optionIndex)}
                              </span>

                              <span className="text-sm leading-5">
                                {option}
                              </span>

                              {/* Feedback icon */}
                              {submitted && correct && (
                                <span className="ml-auto text-emerald-400">
                                  ✓
                                </span>
                              )}

                              {submitted && selected && !correct && (
                                <span className="ml-auto text-red-400">✕</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Question feedback */}
                      {submitted && (
                        <div
                          className={`mt-4 rounded-xl border p-4 ${
                            isCorrect
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : "border-red-500/20 bg-red-500/5"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                isCorrect
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isCorrect ? "✓" : "!"}
                            </div>

                            <div>
                              <p
                                className={`text-sm font-semibold ${
                                  isCorrect
                                    ? "text-emerald-300"
                                    : "text-red-300"
                                }`}
                              >
                                {isCorrect ? "Correct!" : "Incorrect"}
                              </p>

                              {!isCorrect && (
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                  Correct answer:{" "}
                                  <span className="font-medium text-slate-200">
                                    {question.options[correctAnswer]}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Unanswered warning */}
                      {submitted && !isAnswered && (
                        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                          <p className="text-sm font-medium text-amber-300">
                            Not answered
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Correct answer:{" "}
                            <span className="font-medium text-slate-200">
                              {question.options[correctAnswer]}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          {!submitted && (
            <div className="mt-8">
              <button
                type="button"
                onClick={submitQuiz}
                disabled={
                  selectedAnswers.length !== quiz.questions.length ||
                  selectedAnswers.some((answer) => answer === undefined)
                }
                className="w-full rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Quiz
              </button>

              <p className="mt-2 text-center text-xs text-slate-500">
                Answer all questions before submitting.
              </p>
            </div>
          )}

          {/* Score Result */}
          {submitted && (
            <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-400">Your Score</p>

                <p className="mt-2 text-5xl font-bold text-white">
                  {score}
                  <span className="text-2xl text-slate-500">
                    /{quiz.questions.length}
                  </span>
                </p>

                <p className="mt-2 text-xl font-semibold text-blue-400">
                  {getPercentage()}%
                </p>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  {getResultMessage()}
                </p>
              </div>

              {/* Score breakdown */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-950/50 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{score}</p>

                  <p className="mt-1 text-xs text-slate-500">Correct</p>
                </div>

                <div className="rounded-xl bg-slate-950/50 p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">
                    {quiz.questions.length - score}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">Incorrect</p>
                </div>

                <div className="rounded-xl bg-slate-950/50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {getPercentage()}%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">Score</p>
                </div>
              </div>

              {/* Try Again */}
              <button
                type="button"
                onClick={generateQuiz}
                disabled={loading}
                className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Generating..." : "↻ Generate New Quiz"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
