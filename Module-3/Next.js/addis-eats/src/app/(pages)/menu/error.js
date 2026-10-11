"use client";

export default function MenuError({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6 py-12">
      <div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-rose-700">Something went wrong</h1>
        <p className="mt-3 text-slate-600">{error?.message || "The menu could not be loaded."}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

