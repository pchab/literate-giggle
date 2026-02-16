import { HeroPortrait } from "@/components/HeroPortrait";

const HEROES = [
  { id: 1, name: "Valerius", class: "Knight", color: "border-blue-500" },
  { id: 2, name: "Sylas", class: "Mage", color: "border-purple-500" },
  { id: 3, name: "Kael", class: "Rogue", color: "border-green-500" },
];

export default function PartySidebar() {
  return (
    <section className="h-full w-full flex flex-col gap-4">
      <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-500">Party</h2>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {HEROES.map((hero) => (
          <HeroPortrait 
            key={hero.id} 
            name={hero.name} 
            classType={hero.class} 
            color={hero.color} 
          />
        ))}
      </div>
    </section>
  );
}
