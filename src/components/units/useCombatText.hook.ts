import { useEffect, useRef, useState } from "react";

export interface CombatText {
	id: number;
	amount: number;
	type: "damage" | "heal" | "physBlock" | "magBlock";
}

export function useCombatText(
	currentHp: number,
	currentPhysBlock: number = 0,
	currentMagBlock: number = 0,
) {
	const prevHp = useRef(currentHp);
	const prevPhysBlock = useRef(currentPhysBlock);
	const prevMagBlock = useRef(currentMagBlock);

	const [texts, setTexts] = useState<CombatText[]>([]);
	const [isHit, setIsHit] = useState(false);

	useEffect(() => {
		const hpDiff = prevHp.current - currentHp;
		const physDiff = prevPhysBlock.current - currentPhysBlock;
		const magDiff = prevMagBlock.current - currentMagBlock;

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

		if (physDiff > 0) {
			newTexts.push({
				id: Date.now() + Math.random(),
				amount: physDiff,
				type: "physBlock",
			});
			tookDamage = true;
		}

		if (magDiff > 0) {
			newTexts.push({
				id: Date.now() + Math.random(),
				amount: magDiff,
				type: "magBlock",
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
		prevPhysBlock.current = currentPhysBlock;
		prevMagBlock.current = currentMagBlock;
	}, [currentHp, currentPhysBlock, currentMagBlock]);

	return { texts, isHit };
}
