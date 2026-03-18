import { useEffect, useRef, useState } from "react";

export interface CombatText {
	id: number;
	amount: number;
	type: "damage" | "heal" | "block";
}

export function useCombatText(currentHp: number, currentBlock: number = 0) {
	const prevHp = useRef(currentHp);
	const prevBlock = useRef(currentBlock);

	const [texts, setTexts] = useState<CombatText[]>([]);
	const [isHit, setIsHit] = useState(false);

	useEffect(() => {
		const hpDiff = prevHp.current - currentHp;
		const blockDiff = prevBlock.current - currentBlock;

		const newTexts: CombatText[] = [];
		let tookDamage = false;

		if (hpDiff !== 0) {
			newTexts.push({
				id: Date.now() + Math.random(),
				amount: Math.abs(hpDiff),
				type: hpDiff > 0 ? "damage" : "heal",
			});
			if (hpDiff > 0) tookDamage = true;
		}

		if (blockDiff > 0) {
			newTexts.push({
				id: Date.now() + Math.random(),
				amount: blockDiff,
				type: "block",
			});
			tookDamage = true;
		}

		if (newTexts.length > 0) {
			setTexts((prev) => [...prev, ...newTexts]);

			if (tookDamage) {
				setIsHit(true);
				setTimeout(() => setIsHit(false), 400);
			}

			setTimeout(() => {
				const idsToRemove = newTexts.map((t) => t.id);
				setTexts((prev) => prev.filter((t) => !idsToRemove.includes(t.id)));
			}, 1000);
		}

		prevHp.current = currentHp;
		prevBlock.current = currentBlock;
	}, [currentHp, currentBlock]);

	return { texts, isHit };
}
