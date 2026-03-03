import { motion } from "motion/react";
import type { Card, CardEffect } from "@/modules/cards/domain/cards.type";
import { cardLibrary } from "../data/cards.data";

interface CardTooltipProps {
	cardId: Card["id"];
}

function renderEffectText(effect: CardEffect, index: number) {
	switch (effect.type) {
		case "damage": {
			return (
				<span
					key={index}
					className="text-xs text-zinc-300 flex items-center gap-1.5"
				>
					⚔️ Deal <strong className="text-red-400">{effect.amount}</strong>{" "}
					damage.
				</span>
			);
		}
		case "block": {
			const targetText = effect.target === "self" ? "Gain" : "Apply";
			return (
				<span
					key={index}
					className="text-xs text-zinc-300 flex items-center gap-1.5"
				>
					🛡️ {targetText}{" "}
					<strong className="text-zinc-200">{effect.amount}</strong> Block.
				</span>
			);
		}
		case "heal":
			return (
				<span
					key={index}
					className="text-xs text-zinc-300 flex items-center gap-1.5"
				>
					💚 Heal <strong className="text-green-400">{effect.amount}</strong>{" "}
					HP.
				</span>
			);
		case "move":
			return (
				<span
					key={index}
					className="text-xs text-zinc-300 flex items-center gap-1.5"
				>
					👟 Move to target cell.
				</span>
			);
		default:
			return (
				<span key={index} className="text-xs text-zinc-500">
					Unknown effect
				</span>
			);
	}
}

function renderRequirementText(req: string) {
	switch (req) {
		case "requires_enemy":
			return "Target: Enemy";
		case "requires_empty_cell_or_self":
			return "Target: Empty Cell or Self";
		case "requires_empty_cell":
			return "Target: Empty Cell";
		case "requires_ally_or_self":
			return "Target: Ally or Self";
		case "no_target":
			return "Instant Cast";
		default:
			return `Target: ${req}`;
	}
}

export function CardTooltip({ cardId }: CardTooltipProps) {
	const card = cardLibrary[cardId];

	if (!card) {
		return null;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.15, ease: "easeOut" }}
			className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-48 bg-zinc-950 border border-zinc-700 rounded-lg shadow-2xl p-3 z-50 pointer-events-none"
		>
			<div className="flex justify-between items-start border-b border-zinc-800 pb-2 mb-2 gap-2">
				<h3 className="text-sm font-bold text-zinc-100 leading-tight">
					{card.name}
				</h3>
				<span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded whitespace-nowrap border border-zinc-800">
					Range {card.range}
				</span>
			</div>

			<div className="flex flex-col gap-2">
				{card.effects.map((effect, idx) => renderEffectText(effect, idx))}
			</div>

			<div className="mt-3 pt-2 border-t border-zinc-800 text-center">
				<span className="text-[10px] text-zinc-500 italic block tracking-wide uppercase">
					{renderRequirementText(card.playRequirement)}
				</span>
			</div>
		</motion.div>
	);
}
