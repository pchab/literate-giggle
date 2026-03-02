"use client";

import Image from "next/image";
import { useShallow } from "zustand/shallow";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { useBattleStore } from "@/store/battle.store";
import { Hand } from "./cards/Hand";
import { HeroPortrait } from "./HeroPortrait";

function hpPercentToColor(percent: number): string {
	if (percent < 0.2) return "text-red-950";
	if (percent < 0.4) return "text-red-500";
	if (percent < 0.6) return "text-orange-500";
	if (percent < 0.9) return "text-yellow-500";
	return "text-green-500";
}

export function HeroCard({
	id,
	heroClass,
	baseMove,
	hand,
	currentHp,
	maxHp,
	currentBlock,
}: Hero) {
	const { setActiveMoveHeroId, activeMoveHeroId, usedMovesThisTurn } =
		useBattleStore(
			useShallow((state) => ({
				setActiveMoveHeroId: state.setActiveMoveHeroId,
				activeMoveHeroId: state.activeMoveHeroId,
				usedMovesThisTurn: state.usedMovesThisTurn,
			})),
		);

	const hasMoved = usedMovesThisTurn[id];
	const isMoving = activeMoveHeroId === id;
	return (
		<div className="relative flex items-center w-full max-w-2xl h-32 rounded-lg border border-zinc-800 shadow-xl bg-zinc-950 mb-2">
			<div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
				<Image
					src="/hero_card.png"
					alt="Hero"
					fill
					className="object-cover opacity-60"
				/>
			</div>

			<div className="z-10 w-full flex items-center px-4">
				<HeroPortrait classType={heroClass} />

				<div className="flex flex-col">
					<span className="text-sm font-black drop-shadow-md flex gap-1">
						❤️{" "}
						<span className={hpPercentToColor(currentHp / maxHp)}>
							{currentHp}
						</span>
						<span className="text-zinc-500">/</span>
						<span className="text-zinc-500">{maxHp}</span>
					</span>

					{currentBlock > 0 && (
						<div className="flex gap-1.5 mt-1">
							{currentBlock > 0 && (
								<span className="text-[10px] font-bold text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-600 shadow-sm">
									🛡️ {currentBlock}
								</span>
							)}
						</div>
					)}
					<button
						type="button"
						onClick={() => setActiveMoveHeroId(isMoving ? null : id)}
						disabled={hasMoved}
						className={`
            px-3 py-1 text-xs rounded-full border transition-colors
            ${
							hasMoved
								? "bg-zinc-800 text-zinc-600 border-zinc-700"
								: isMoving
									? "bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
									: "bg-zinc-800 text-zinc-300 border-zinc-600 hover:bg-zinc-700"
						}
        `}
					>
						{hasMoved ? "Moved" : `Move (${baseMove})`}
					</button>
				</div>

				<div className="w-px h-16 bg-gradient-to-b from-transparent via-zinc-700 to-transparent mx-2" />

				<div className="flex-1">
					<Hand id={id} hand={hand} />
				</div>
			</div>
		</div>
	);
}
