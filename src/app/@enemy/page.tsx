export default function EnemyArea() {
  return (
    <section className="h-full w-full flex flex-col gap-4">
      <h2 className="text-xl font-bold uppercase tracking-wider text-red-900/50 text-right">Enemy</h2>
      <div className="flex-1 flex flex-col gap-4">
        <div className="h-1/2 rounded-lg border border-dashed border-red-900/20 bg-red-950/10 flex items-center justify-center text-red-900/50">
          Enemy Sprite
        </div>
        <div className="h-1/4 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-600">
          Intent Tooltip
        </div>
      </div>
    </section>
  );
}
