import { BattleGrid, type Unit } from "@/components/BattleGrid";

export default function Home() {
  const initialUnits: Unit[] = [
    { id: "u1", type: "Knight", col: 1, row: 1 },
    { id: "u2", type: "Mage", col: 1, row: 2 },
  ];

  return (
    <section className="h-full w-full flex flex-col bg-zinc-950">
      <div className="flex-1 flex items-center justify-center p-8">
        <BattleGrid units={initialUnits} />
      </div>
    </section>
  );
}
