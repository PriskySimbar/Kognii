"use client";

import { useState } from "react";

type Flashcard = {
  question: string;
  answer: string;
};

type FlashcardResponse = {
  cards: Flashcard[];
};

export default function FlashcardSection({ content }: { content: string }) {
  const [flashcards, setFlashcards] = useState<FlashcardResponse | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateFlashcards() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/ai/flashcards", {
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
        throw new Error(data.error || "Failed to generate flashcards");
      }

      setFlashcards(data);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function nextCard() {
    if (!flashcards) return;

    if (currentIndex < flashcards.cards.length - 1) {
      setCurrentIndex((current) => current + 1);
      setFlipped(false);
    }
  }

  function previousCard() {
    if (currentIndex > 0) {
      setCurrentIndex((current) => current - 1);
      setFlipped(false);
    }
  }

  const currentCard = flashcards?.cards[currentIndex];

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            ◆
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">AI Flashcards</h2>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Review important concepts from your material.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={generateFlashcards}
          disabled={loading}
          className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating..." : "◆ Generate Flashcards"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Flashcards */}
      {flashcards && currentCard && (
        <div className="mt-8">
          {/* Progress */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Study Cards</p>

              <p className="mt-1 text-xs text-slate-500">
                {flashcards.cards.length} cards
              </p>
            </div>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
              {currentIndex + 1} / {flashcards.cards.length}
            </span>
          </div>

          {/* Card */}
          <button
            type="button"
            onClick={() => setFlipped((current) => !current)}
            className="group w-full text-left"
          >
            <div
              className={`flex min-h-70 flex-col justify-center rounded-2xl border p-8 text-center transition ${
                flipped
                  ? "border-purple-500/30 bg-purple-500/5"
                  : "border-slate-700 bg-slate-900 hover:border-purple-500/40"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                {flipped ? "Answer" : "Question"}
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-xl font-semibold leading-9 text-white">
                {flipped ? currentCard.answer : currentCard.question}
              </p>

              <p className="mt-8 text-xs text-slate-500">
                Click the card to {flipped ? "see question" : "reveal answer"}
              </p>
            </div>
          </button>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousCard}
              disabled={currentIndex === 0}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={nextCard}
              disabled={currentIndex === flashcards.cards.length - 1}
              className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
