import { BattleGrid } from "@/components/BattleGrid";

export default function Home() {
  return (
    <section className="h-full w-full flex flex-col bg-zinc-950">
      <div className="flex-1 flex items-center justify-center p-8">
        <BattleGrid />
      </div>
    </section>
  );
}
