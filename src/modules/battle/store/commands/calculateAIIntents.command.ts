import { useRegistryStore } from "@/modules/shared/store/registry.store";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/units/domain/units.type";
import { isMonster, isSummon } from "@/modules/units/helpers/units.helpers";
import type { Intent } from "../../domain/intent.type";
import { getSimulationState } from "../../helpers/simulation.helper";
import { calculateStateDiff } from "../../helpers/state.helpers";
import type { BattleGet, BattleSet } from "../battle.store";
import { resolveAIActions } from "./resolveAIAction.command";

function isAiBattleUnit(unit: BattleUnit): unit is AIBattleUnit {
	return isMonster(unit) || isSummon(unit);
}

export const calculateAIIntents =
	(get: BattleGet, set: BattleSet) =>
	async (
		existingIntents: Record<BattleUnit["id"], Intent> = get().aiIntents,
	): Promise<void> => {
		const { units } = get();

		const aiUnits = units
			.filter(isAiBattleUnit)
			.filter((f) => f.currentHp > 0 && (f.intentPool?.length ?? 0) > 0);

		const { fakeGet, fakeSet } = getSimulationState(get);

		const baselineIntents: Record<string, Intent> = {};

		for (const aiunit of aiUnits) {
			let selectedCardId = existingIntents[aiunit.id]?.cardId;

			if (!selectedCardId) {
				const totalWeight = aiunit.intentPool.reduce(
					(sum, intent) => sum + intent.weight,
					0,
				);
				let randomNum = Math.random() * totalWeight;
				selectedCardId = aiunit.intentPool[0].cardId;

				for (const intent of aiunit.intentPool) {
					randomNum -= intent.weight;
					if (randomNum <= 0) {
						selectedCardId = intent.cardId;
						break;
					}
				}
			}
			const isValidCard = useRegistryStore.getState().getCard(selectedCardId);
			if (isValidCard) {
				baselineIntents[aiunit.id] = {
					unitId: aiunit.id,
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
		const previousUnits = units;
		set((prev) => ({
			...prev,
			aiStateDiff: calculateStateDiff(simulatedUnits, previousUnits),
			aiIntents: simulatedAiIntents,
		}));
	};
