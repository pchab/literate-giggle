import Image from "next/image";
import type { Card } from "@/modules/cards/cards.type";

export function CardComponent({ name }: Card) {
	return (
		<div className="relative">
			<Image src={"/card.png"} alt={name} width={65} height={100} />
			<div className="absolute inset-0 flex justify-center items-center text-sm font-bold text-white">
				{name}
			</div>
		</div>
	);
}
