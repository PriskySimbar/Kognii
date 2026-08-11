import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import UploadMaterial from "./UploadMaterial";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const materials = await prisma.material.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            Kognii<span className="text-blue-400">.</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{session.user.name}</p>

              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-400">
              AI STUDY ASSISTANT
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Welcome back, {session.user.name?.split(" ")[0]} 👋
            </h1>

            <p className="mt-3 text-slate-400">
              Continue learning and let Kognii help you understand.
            </p>
          </div>

          <Link
            href="/materials/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 font-medium transition hover:bg-blue-400"
          >
            + Add Material
          </Link>
        </div>
        <div className="mt-10">
          <UploadMaterial />
        </div>
        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Materials" value={materials.length.toString()} />

          <StatCard label="AI Summaries" value="0" />

          <StatCard label="Quizzes" value="0" />
        </div>

        {/* Materials */}
        <div className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Materials</h2>

              <p className="mt-1 text-sm text-slate-500">
                Your recently added study materials.
              </p>
            </div>
          </div>

          {materials.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  id={material.id}
                  title={material.title}
                  content={material.content}
                  createdAt={material.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function MaterialCard({
  id,
  title,
  content,
  createdAt,
}: {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          ✦
        </div>

        <span className="text-xs text-slate-600">
          {createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
        {content}
      </p>

      <Link
        href={`/materials/${id}`}
        className="mt-5 inline-block text-sm font-medium text-blue-400 transition hover:text-blue-300"
      >
        Open material →
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl">
        +
      </div>

      <h3 className="mt-4 font-medium">No study materials yet</h3>

      <p className="mt-2 text-sm text-slate-500">
        Add your first material and start learning with Kognii.
      </p>

      <Link
        href="/materials/new"
        className="mt-6 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium transition hover:bg-blue-400"
      >
        Add your first material
      </Link>
    </div>
  );
}
