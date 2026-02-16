import { HeroCard } from "@/components/HeroCard";

const HEROES = [
  { id: 1, class: "Squire", color: "border-blue-500" },
  { id: 2, class: "Warrior", color: "border-purple-500" },
  { id: 3, class: "Thief", color: "border-green-500" },
];

export default function PartySidebar() {
  return (
    <section className="h-full w-full flex flex-col gap-4 relative">
      {/* Hero List */}
      <div className="flex-1 flex flex-col justify-around overflow-y-auto no-scrollbar">
        {HEROES.map((hero) => (
           <HeroCard classType={hero.class} key={hero.id} />
        ))}
      </div>
    </section>
  );
}
