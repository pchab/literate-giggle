import Image from "next/image";
import { Hand } from "./Hand";
import { HeroPortrait } from "./HeroPortrait";
import type { Hero } from "@/modules/figures/figures.type";

export function HeroCard({ id, heroClass, cards }: Hero) {
	return (
		<div className="relative flex flex-col">
			<Image
				src="/hero_card.png"
				alt="Hero"
				fill={true}
				className="absolute inset-0 z-O"
			/>
			<div className="flex z-10 justify-center items-center">
				<HeroPortrait classType={heroClass} />
				<Hand id={id} cards={cards} />
			</div>
		</div>
	);
}
