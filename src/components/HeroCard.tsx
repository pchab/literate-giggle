import Image from "next/image";
import type { Hero } from "@/modules/figures/domain/figures.type";
import { Hand } from "./Hand";
import { HeroPortrait } from "./HeroPortrait";

export function HeroCard({
	id,
	heroClass,
	cards,
	currentHp,
	maxHp,
	currentPhysBlock,
	currentMagBlock,
}: Hero) {
	return (
		<div className="relative flex flex-col">
			<Image
				src="/hero_card.png"
				alt="Hero"
				fill={true}
				className="absolute inset-0 z-0"
			/>
			<div className="flex z-10 justify-center items-center">
				<HeroPortrait classType={heroClass} />
				<span className="text-xs text-zinc-300 ml-2">
					HP: {currentHp}/{maxHp}
				</span>
				<span className="text-xs text-zinc-300 ml-2">
					Block: Phys {currentPhysBlock} / Mag {currentMagBlock}
				</span>
				<Hand id={id} cards={cards} />
			</div>
		</div>
	);
}
