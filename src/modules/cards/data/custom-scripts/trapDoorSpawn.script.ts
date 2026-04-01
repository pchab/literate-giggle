import type { Intent } from "@/modules/battle/domain/intent.type";
import { handleAICardIntent } from "@/modules/battle/helpers/ai.actions.helpers";
import type { EffectResolver } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	getCellId,
	isTileEmpty,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import { summonLibrary } from "@/modules/figures/data/summons/summons.data";
import {
	type BattleUnit,
	type Summon,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { summonId } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import type { CustomScriptEffect } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { monsterCardLibrary } from "../monsters/monsterCards.data";

export const trapdoorSpawn: EffectResolver<
	BattleUnit,
	CustomScriptEffect<{ spawnCount: number; blueprintId: Summon["id"] }>
> =
	(get, set, isSimulation = false) =>
	({ payload }) =>
	async ({ caster }) => {
		const { units, surfaces, gridSize } = get();

		const targetPos = { col: 2, row: 2 };
		const isBlocked = !isTileEmpty(units)(targetPos);

		// --- TRAP DOOR BLOCKED => ATTACK WHOEVER IS BLOCKING IT ! ---
		if (isBlocked) {
			const nastyBiteId = cardId("nasty_bite");
			const nastyBiteCard = monsterCardLibrary[nastyBiteId];
			const newIntent: Intent = {
				cardId: nastyBiteId,
				figureId: caster.id,
			};
			set(({ aiIntents, ...prev }) => ({
				...prev,
				aiIntents: {
					...aiIntents,
					[caster.id]: newIntent,
				},
			}));

			await handleAICardIntent(
				get,
				set,
				isSimulation,
			)({ attackerId: caster.id, card: nastyBiteCard });

			return;
		}

		// --- TRAP DOOR FREE => SUMMONS RATS ! ---
		const trapdoorSurface = surfaces[getCellId(targetPos)];
		set((prev) => ({
			...prev,
			surfaces: {
				...surfaces,
				[getCellId(targetPos)]: {
					...trapdoorSurface,
					spriteBase: "/surfaces/open_trapdoor.webp",
				},
			},
		}));
		await sleep(isSimulation ? 0 : 1000);

		const neighbors = [
			{ col: targetPos.col, row: targetPos.row - 1 },
			{ col: targetPos.col, row: targetPos.row + 1 },
			{ col: targetPos.col - 1, row: targetPos.row },
			{ col: targetPos.col + 1, row: targetPos.row },
		];

		const validSpawns = neighbors
			.filter(isTileInBounds(gridSize))
			.filter(isTileEmpty(units));

		const spawnAmount = payload.spawnCount;
		const spawnTiles = validSpawns.slice(0, spawnAmount);
		const blueprint = summonLibrary[payload.blueprintId];

		if (spawnTiles.length === 0) return;

		const newRats: Summon[] = spawnTiles.map((pos, index) => ({
			id: summonId(`trap-door-rat-${Date.now()}-${index}`),
			...blueprint,
			stance: UnitStance.IDLE,
			currentHp: blueprint.maxHp,
			statuses: [],
			gridPosition: pos,
			allegiance: "ENEMY",
		}));

		set((prev) => ({
			...prev,
			units: [...prev.units, ...newRats],
			surfaces: {
				...surfaces,
				[getCellId(targetPos)]: {
					...trapdoorSurface,
					spriteBase: "/surfaces/closed_trapdoor.webp",
				},
			},
		}));
	};
