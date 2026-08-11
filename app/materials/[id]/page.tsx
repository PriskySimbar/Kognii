import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AISection from "./AISection";
import QuizSection from "./QuizSections";
import FlashcardSection from "./FlashcardSection";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const material = await prisma.material.findFirst({
    where: {
      id,
      user: {
        email: session.user.email,
      },
    },
    include: {
      summary: true,
    },
  });

  if (!material) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
            ✦
          </div>

          <h1 className="text-4xl font-bold">{material.title}</h1>

          <p className="mt-3 text-sm text-slate-500">
            Added{" "}
            {material.createdAt.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Material */}
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="mb-5 text-lg font-semibold">Study Material</h2>

          <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-300">
            {material.content}
          </div>
        </article>

        {/* AI Section */}
        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              ✦
            </div>

            <div>
              <h2 className="font-semibold">Ready to study?</h2>

              <p className="text-sm text-slate-400">
                Let Kognii turn this material into learning tools.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              <AISection
                materialId={material.id}
                initialSummary={material.summary?.content ?? ""}
              />
            </div>

            <div className="min-w-0">
              <QuizSection content={material.content} />
            </div>
          </div>

          <FlashcardSection content={material.content} />
        </div>
      </section>
    </main>
  );
}
