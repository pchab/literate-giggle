import Image from "next/image";

interface HeroPortraitProps {
	classType: string;
}

const PORTRAITS: Record<string, string> = {
	Squire: "/hero_portrait_squire.png",
	Warrior: "/hero_portrait_warrior.png",
	Mage: "/hero_portrait_mage.png",
	Thief: "/hero_portrait_thief.png",
};

export function HeroPortrait({ classType }: HeroPortraitProps) {
	const imageSrc = PORTRAITS[classType] || "/hero_portrait_squire.png"; // Fallback

	return (
		<div className="relative w-48 h-36 m-4">
			<Image
				src="/hero_runes.png"
				alt="Hero Runes"
				width={120}
				height={120}
				className="absolute inset-0 z-0 m-auto"
			/>
			<Image
				src={imageSrc}
				alt={classType}
				width={80}
				height={80}
				className="absolute inset-0 z-10 m-auto"
			/>
		</div>
	);
}
