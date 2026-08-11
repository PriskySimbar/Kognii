import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Kognii<span className="text-blue-400">.</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white"
          >
            Log in
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              ✦ AI-powered learning
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Study smarter.
              <br />
              <span className="text-blue-400">Understand deeper.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Turn your study materials into clear summaries, smart quizzes, and
              interactive flashcards with AI.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-blue-500 px-6 py-3 font-medium transition hover:bg-blue-400"
              >
                Start Learning →
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Right - Product Preview */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">AI Study Assistant</p>
                  <h2 className="mt-1 text-lg font-semibold">Photosynthesis</h2>
                </div>

                <div className="rounded-lg bg-blue-500/10 px-3 py-2 text-sm text-blue-400">
                  AI
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                    AI Summary
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Photosynthesis is the process plants use to convert light
                    energy into chemical energy...
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-sm font-medium">✦ Key Concepts</p>
                    <p className="mt-2 text-xs text-slate-500">
                      8 concepts identified
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-sm font-medium">◇ Quiz</p>
                    <p className="mt-2 text-xs text-slate-500">
                      10 questions generated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-900 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium text-blue-400">
              EVERYTHING IN ONE PLACE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              From material to mastery.
            </h2>

            <p className="mt-4 text-slate-400">
              Kognii helps you transform your existing study materials into
              useful learning tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              icon="✦"
              title="AI Summary"
              description="Turn long study materials into concise, understandable summaries."
            />

            <Feature
              icon="◇"
              title="Smart Quiz"
              description="Generate questions from your own materials and test your understanding."
            />

            <Feature
              icon="▣"
              title="Flashcards"
              description="Create focused flashcards to help you review important concepts."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl justify-between text-sm text-slate-500">
          <span>© 2026 Kognii</span>
          <span>AI Study Assistant</span>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-slate-700">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
