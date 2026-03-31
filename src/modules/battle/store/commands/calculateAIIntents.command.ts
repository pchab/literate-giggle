import { cardLibrary } from "@/modules/cards/data/cards.data";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/figures/domain/figures.type";
import { isMonster, isSummon } from "@/modules/figures/helpers/figures.helpers";
import type { Intent } from "../../domain/intent.type";
import { getSimulationState } from "../../helpers/simulation.helper";
import { calculateStateDiff } from "../../helpers/state.helpers";
import type { StoreGet, StoreSet } from "../battle.store";
import { resolveAIActions } from "./resolveAIAction.command";

function isAiBattleUnit(unit: BattleUnit): unit is AIBattleUnit {
	return isMonster(unit) || isSummon(unit);
}

export const calculateAIIntents =
	(get: StoreGet, set: StoreSet) =>
	async (
		existingIntents: Record<BattleUnit["id"], Intent> = get().aiIntents,
	): Promise<void> => {
		const { units } = get();

		const aiFigures = units
			.filter(isAiBattleUnit)
			.filter((f) => f.currentHp > 0 && (f.intentPool?.length ?? 0) > 0);

		const { fakeGet, fakeSet } = getSimulationState(get);

		const baselineIntents: Record<string, Intent> = {};

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

			if (cardLibrary[selectedCardId]) {
				baselineIntents[aiFigure.id] = {
					figureId: aiFigure.id,
					cardId: selectedCardId,
				};
			}
		}

		fakeSet((prev) => ({
			...prev,
			aiIntents: {
				...prev.aiIntents,
				...baselineIntents,
			},
		}));

		await resolveAIActions(fakeGet, fakeSet, true);

		const { units: simulatedUnits, aiIntents: simulatedAiIntents } = fakeGet();
		const previousFigures = units;
		set((prev) => ({
			...prev,
			aiStateDiff: calculateStateDiff(simulatedUnits, previousFigures),
			aiIntents: simulatedAiIntents,
		}));
	};
