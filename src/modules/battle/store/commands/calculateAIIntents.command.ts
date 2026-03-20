import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isMonster, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { Intent } from "../../domain/intent.type";
import { getSimulationState } from "../../helpers/simulation.helper";
import type { StoreGet, StoreSet } from "../battle.store";
import { resolveAIActions } from "./resolveAIAction.command";

export const calculateAIIntents =
	(get: StoreGet, set: StoreSet) =>
	async (
		existingIntents: Record<BattleUnit["id"], Intent> = get().aiIntents,
	): Promise<void> => {
		const { monsters, summons } = get();
		const aiFigures = [...monsters, ...summons]
			.filter((f) => (isMonster(f) || isSummon(f)) && f.currentHp > 0)
			.filter(({ intentPool }) => intentPool.length > 0);

		const { fakeGet, fakeSet } = getSimulationState(get);

		for (const aiFigure of aiFigures) {
			let selectedCardId = existingIntents[aiFigure.id]?.cardId;
			if (!selectedCardId) {
				const totalWeight = aiFigure.intentPool.reduce(
					(sum, intent) => sum + intent.weight,
					0,
				);
				let randomNum = Math.random() * totalWeight;
				selectedCardId = aiFigure.intentPool[0].cardId;

				for (const intent of aiFigure.intentPool) {
					randomNum -= intent.weight;
					if (randomNum <= 0) {
						selectedCardId = intent.cardId;
						break;
					}
				}
			}

			const plannedCard = cardLibrary[selectedCardId];
			if (plannedCard) {
				fakeSet(({ aiIntents, ...prev }) => ({
					...prev,
					aiIntents: {
						...aiIntents,
						[aiFigure.id]: {
							figureId: aiFigure.id,
							cardId: selectedCardId,
						},
					},
				}));
			}
		}

		// Run simulation using current position
		await resolveAIActions(fakeGet, fakeSet, true);

		const simulatedAiIntents = fakeGet().aiIntents;
		set((prev) => ({
			...prev,
			aiIntents: simulatedAiIntents,
		}));
	};
