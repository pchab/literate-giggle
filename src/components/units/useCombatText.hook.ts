import { useEffect, useRef, useState } from "react";

export interface CombatText {
	id: number;
	amount: number;
	type: "damage" | "heal";
}

export function useCombatText(currentHp: number) {
	const prevHp = useRef(currentHp);
	const [texts, setTexts] = useState<CombatText[]>([]);
	const [isHit, setIsHit] = useState(false);

	useEffect(() => {
		const diff = prevHp.current - currentHp;

		if (diff !== 0) {
			// It's a hit or a heal!
			const isDamage = diff > 0;
			const newText: CombatText = {
				id: Date.now() + Math.random(), // Unique ID for React keys
				amount: Math.abs(diff),
				type: isDamage ? "damage" : "heal",
			};

			setTexts((prev) => [...prev, newText]);

			// Trigger the flash animation if it was damage
			if (isDamage) {
				setIsHit(true);
				setTimeout(() => setIsHit(false), 400); // matches CSS duration
			}

			// Cleanup the floating text after it finishes animating (1 second)
			setTimeout(() => {
				setTexts((prev) => prev.filter((t) => t.id !== newText.id));
			}, 1000);
		}

		prevHp.current = currentHp;
	}, [currentHp]);

	return { texts, isHit };
}
