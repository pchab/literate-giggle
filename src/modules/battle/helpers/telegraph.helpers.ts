import type { GridPosition } from "../domain/grid.type";
import type { BattleGet, BattleSet } from "../store/battle.store";

/**
 * The cells a telegraphed move will hit. Chosen once, the first time the move is
 * simulated (when the intent is shown), then kept until it resolves: heroes can step
 * out of a marked tile, and anything pushed into one gets hit.
 */
export const lockedZone =
	(get: BattleGet, set: BattleSet, isSimulation: boolean) =>
	(casterId: string, choose: () => GridPosition[]): GridPosition[] => {
		const intent = get().aiIntents[casterId];
		const zone = intent?.lockedZone ?? choose();
		if (isSimulation && intent) {
			set(({ aiIntents }) => ({
				aiIntents: {
					...aiIntents,
					[casterId]: {
						...aiIntents[casterId],
						lockedZone: zone,
						dangerZone: zone,
					},
				},
			}));
		}
		return zone;
	};
