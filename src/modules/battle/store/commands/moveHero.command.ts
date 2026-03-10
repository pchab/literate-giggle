import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { getManhattanDistance } from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { isHeroId } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import { calculateExactPath } from "../../helpers/ai.move.helpers";
import { calculateAllIntents } from "./calculateAllIntents.command";

export function moveHero(newPosition: GridPosition) {
	return async (get: StoreGet, set: StoreSet) => {
		const { activeMoveUnitId, usedMovesThisTurn, heroes, monsters, summons } =
			get();
		if (
			!activeMoveUnitId ||
			!isHeroId(activeMoveUnitId) ||
			usedMovesThisTurn[activeMoveUnitId]
		) {
			return {};
		}

		set(() => ({
			activeMoveUnitId: null,
		}));

		const allBlockingFigures = [
			...monsters,
			...summons.filter(({ allegiance }) => allegiance === "ENEMY"),
		];

		const heroId = activeMoveUnitId;
		const hero = heroes.find((h) => h.id === heroId);
		if (!hero) {
			console.warn(`Hero with ID ${heroId} not found.`);
			return {};
		}
		const distance = getManhattanDistance(newPosition, hero.gridPosition);
		if (distance > hero.baseMove) {
			console.warn(
				`Hero ${heroId} cannot move more than ${hero.baseMove} squares.`,
			);
			return {};
		}

		const path = calculateExactPath(
			hero.gridPosition,
			newPosition,
			allBlockingFigures,
		);

		for (const step of path) {
			set(({ heroes }) => {
				const heroIndex = heroes.findIndex((h) => h.id === heroId);
				if (heroIndex === -1) return { heroes };
				const draftHero = { ...heroes[heroIndex], gridPosition: step };
				return { heroes: heroes.with(heroIndex, draftHero) };
			});
			await sleep(200);

			// 🔮 FUTURE TRAP LOGIC GOES HERE 🔮
			// const currentSurface = get().surfaces[`${step.row}-${step.col}`];
			// if (currentSurface?.type === "TRAP") {
			//   triggerTrap();
			//   break; // Stops the loop so they don't finish moving!
			// }
		}

		return set(({ heroes, aiIntents, usedMovesThisTurn }) => {
			const newIntents = calculateAllIntents(
				heroes,
				monsters,
				summons,
				aiIntents,
			);
			return {
				usedMovesThisTurn: { ...usedMovesThisTurn, [heroId]: true },
				aiIntents: newIntents,
			};
		});
	};
}
