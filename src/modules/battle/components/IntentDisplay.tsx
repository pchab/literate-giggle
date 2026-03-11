import type { AIIntent } from "@/modules/battle/domain/intent.type";
import { cardLibrary } from "@/modules/cards/data/cards.data";

export default function IntentDisplay({ intent }: { intent: AIIntent }) {
	const card = cardLibrary[intent.cardId];
	if (!card) return null;

	let totalDamage = 0;
	let totalBlock = 0;
	let totalHeal = 0;

	card.effects.forEach((effect) => {
		if (effect.type === "damage") totalDamage += effect.amount;
		if (
			effect.type === "apply_status" &&
			["temp_block", "perma_shield"].includes(effect.status.type)
		) {
			totalBlock += effect.status.amount;
		}
		if (effect.type === "heal") totalHeal += effect.amount;
	});

	// 3. Map your new generic iconType to emojis (or swap these for your actual icon SVG components!)
	const iconMap: Record<string, string> = {
		MELEE: "⚔️",
		RANGED: "🏹",
		MAGIC: "✨",
		DEFEND: "🛡️",
		DEBUFF: "💢",
		SUMMON: "💀",
	};

	const displayIcon = card.iconType ? iconMap[card.iconType] : "❓";

	return (
		<div className="absolute -top-8 bg-zinc-950/90 border border-zinc-700 rounded px-2 py-1 flex items-center gap-1.5 shadow-lg pointer-events-none z-20">
			{/* ATTACK INTENT */}
			{totalDamage > 0 && (
				<span className="text-xs font-bold text-red-400">
					{displayIcon} {totalDamage}
				</span>
			)}

			{/* BLOCK INTENT */}
			{totalBlock > 0 && (
				<span className="text-xs font-bold text-blue-400">🛡️ {totalBlock}</span>
			)}

			{/* HEAL INTENT */}
			{totalHeal > 0 && (
				<span className="text-xs font-bold text-green-400">💚 {totalHeal}</span>
			)}

			{/* FALLBACK (For pure summons or debuffs that deal no damage) */}
			{totalDamage === 0 && totalBlock === 0 && totalHeal === 0 && (
				<span className="text-xs font-bold text-gray-300" title={card.name}>
					{displayIcon}
				</span>
			)}
		</div>
	);
}
