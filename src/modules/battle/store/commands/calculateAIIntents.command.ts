import type { Card } from "@/modules/cards/domain/cards.type";
import { useRegistryStore } from "@/modules/shared/store/registry.store";
import type {
	AIBattleUnit,
	BattleUnit,
} from "@/modules/units/domain/units.type";
import { isMonster, isSummon } from "@/modules/units/helpers/units.helpers";
import type { Intent } from "../../domain/intent.type";
import {
	isScripted,
	nextScriptedIntent,
} from "../../helpers/bossScript.helpers";
import { getSimulationState } from "../../helpers/simulation.helper";
import { calculateStateDiff } from "../../helpers/state.helpers";
import type { Bark, BattleGet, BattleSet } from "../battle.store";
import { resolveAIActions } from "./resolveAIAction.command";

function isAiBattleUnit(unit: BattleUnit): unit is AIBattleUnit {
	return isMonster(unit) || isSummon(unit);
}

export const calculateAIIntents =
	(get: BattleGet, set: BattleSet) =>
	async (
		existingIntents: Record<BattleUnit["id"], Intent> = get().aiIntents,
	): Promise<void> => {
		const { sandboxCardOverride } = get();

		const aiUnits = get()
			.units.filter(isAiBattleUnit)
			.filter(
				(f) =>
					f.currentHp > 0 && ((f.intentPool?.length ?? 0) > 0 || isScripted(f)),
			);

		// Scripted bosses: next move of their pattern (or a new phase), stored on the unit.
		const scriptedPicks: Record<string, Card["id"]> = {};
		const unitPatches: Record<string, Partial<BattleUnit>> = {};
		const newBarks: Bark[] = [];
		for (const aiunit of aiUnits) {
			if (existingIntents[aiunit.id]?.cardId) continue;
			const scripted = nextScriptedIntent(aiunit);
			if (!scripted) continue;
			scriptedPicks[aiunit.id] = scripted.cardId;
			if (scripted.unitPatch) unitPatches[aiunit.id] = scripted.unitPatch;
			if (scripted.bark) {
				newBarks.push({
					id: `${aiunit.id}-${Date.now()}`,
					unitId: aiunit.id,
					text: scripted.bark,
				});
			}
		}
		if (Object.keys(unitPatches).length || newBarks.length) {
			set((prev) => ({
				units: prev.units.map((u) =>
					unitPatches[u.id] ? { ...u, ...unitPatches[u.id] } : u,
				),
				barks: [...prev.barks, ...newBarks],
			}));
		}
		const { units } = get();

		const { fakeGet, fakeSet } = getSimulationState(get);

		const baselineIntents: Record<string, Intent> = {};
		for (const aiunit of aiUnits) {
			let selectedCardId =
				existingIntents[aiunit.id]?.cardId ?? scriptedPicks[aiunit.id];

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

			const isOverride = sandboxCardOverride?.id === selectedCardId;
			const registryCard = useRegistryStore.getState().getCard(selectedCardId);
			const isValidCard = isOverride || !!registryCard;

			if (isValidCard) {
				baselineIntents[aiunit.id] = {
					unitId: aiunit.id,
					cardId: selectedCardId,
					// A telegraph stays where it was shown, whatever moved since.
					lockedZone: existingIntents[aiunit.id]?.lockedZone,
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
