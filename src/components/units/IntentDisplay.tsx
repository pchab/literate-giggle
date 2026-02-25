import type { MonsterIntent } from "@/modules/attacks/attacks";

export default function IntentDisplay({ intent }: { intent: MonsterIntent }) {
    return (
        <div className="absolute -top-8 bg-zinc-950/90 border border-zinc-700 rounded px-2 py-1 flex items-center gap-1.5 shadow-lg pointer-events-none z-20">
					<span className="text-xs drop-shadow-md">
						{intent.attackData.effect === "physDmg" ? "⚔️" : "🔮"}
					</span>
					<span className="text-xs font-bold text-red-400">
						{intent.attackData.damage}
					</span>
				</div>
    )
}