export default function MenuLoading() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mb-6 h-6 w-40 rounded bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-40 rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </main>
  );
}

