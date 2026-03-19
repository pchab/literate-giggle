import { cardLibrary } from "@/modules/cards/data/cards.data";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../store/battle.store";
import { handleAICardIntent } from "./ai.actions.helpers";

export const processUnitDeath =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	async ({ id: deadUnitId, onDeath }: BattleUnit) => {
		if (!onDeath) return;

		const onDeathCard = cardLibrary[onDeath];
		await handleAICardIntent(get, set, isSimulation)(deadUnitId, onDeathCard);
	};
