"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewMaterialPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-4xl items-center px-6 py-5">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">NEW MATERIAL</p>

          <h1 className="mt-2 text-4xl font-bold">Add study material</h1>

          <p className="mt-3 text-slate-400">
            Add your study material and Kognii will help you understand it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Material title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Database Systems"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Content */}
          <div className="mt-6">
            <label htmlFor="content" className="mb-2 block text-sm font-medium">
              Study material
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste your study material here..."
              rows={14}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-500 px-6 py-3 font-medium transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Material"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
