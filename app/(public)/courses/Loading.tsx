// src/app/courses/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50" aria-busy="true">
      <div className="rounded-b-[2rem] bg-cyan-950 md:rounded-b-[3rem]">
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="h-10 w-3/4 max-w-xl rounded-lg bg-white/15 sm:h-14" />
          <div className="mt-3 h-10 w-1/2 max-w-md rounded-lg bg-white/15 sm:h-14" />
          <div className="mt-6 h-5 w-full max-w-md rounded bg-white/10" />
          <div className="mt-8 h-12 w-40 rounded-full bg-amber-500/60" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl animate-pulse px-4 pt-8 sm:px-6 md:pt-12 lg:px-8">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-cyan-950/10" />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-72 rounded-2xl bg-cyan-950/8 ${
                i > 1 ? "hidden sm:block" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
