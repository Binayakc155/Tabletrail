export default function OwnerLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 pb-24 lg:pb-0">
      <div className="h-56 animate-pulse rounded-[2rem] bg-white/80 shadow-xl shadow-slate-950/5" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl bg-white/80" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-96 animate-pulse rounded-2xl bg-white/80" />
        ))}
      </div>
    </section>
  );
}
