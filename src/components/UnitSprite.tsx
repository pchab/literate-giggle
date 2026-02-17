import type { Hero } from "@/modules/figures/figures.type";
import Image from "next/image";

interface UnitSpriteProps {
	type: Hero["heroClass"];
}

const UNIT_ASSETS: Record<Hero["heroClass"], string> = {
	Squire: "/sprites/squire_0.png",
	Knight: "/sprites/warrior_0.png",
	Mage: "/sprites/mage_0.png",
	Thief: "/sprites/thief_0.png",
};

export function UnitSprite({ type }: UnitSpriteProps) {
	const src = UNIT_ASSETS[type];

	return (
		<div className="relative w-full h-full flex items-center justify-center pointer-events-none -translate-y-4">
			<Image src={src} alt={type} fill className="object-contain" priority />
		</div>
	);
}
