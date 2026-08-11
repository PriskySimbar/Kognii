import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Kognii</h1>

        <p className="mt-2 mb-8 text-gray-500">
          Your AI-powered study assistant
        </p>

        <form
          action={async () => {
            "use server";

            await signIn("google", {
              redirectTo: "/dashboard",
            });
          }}
        >
          <button
            type="submit"
            className="rounded-lg border px-6 py-3 hover:bg-gray-500"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}
