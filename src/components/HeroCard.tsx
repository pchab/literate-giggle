import Image from "next/image";
import type { Hero } from "@/modules/figures/domain/figures.type";
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
	cards,
	currentHp,
	maxHp,
	currentBlock,
}: Hero) {
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

					{(currentBlock > 0) && (
						<div className="flex gap-1.5 mt-1">
							{currentBlock > 0 && (
								<span className="text-[10px] font-bold text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-600 shadow-sm">
									🛡️ {currentBlock}
								</span>
							)}
						</div>
					)}
				</div>

				<div className="w-px h-16 bg-gradient-to-b from-transparent via-zinc-700 to-transparent mx-2" />

				<div className="flex-1">
					<Hand id={id} cards={cards} />
				</div>
			</div>
		</div>
	);
}
