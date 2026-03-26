import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	type AnchorResolver,
	handleAICardIntent,
	type TargetResolver,
} from "@/modules/battle/helpers/ai.actions.helpers";
import { areEnemies } from "@/modules/battle/helpers/effects/effect.helpers";
import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	calculateReachableCells,
	GRID_BOUNDS,
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import {
	calculateExactPath,
	moveBattleUnit,
} from "@/modules/battle/helpers/move.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { acidFlask } from "@/modules/figures/data/summons/acidFlask";
import type { AIBattleUnit } from "@/modules/figures/domain/figures.type";
import { cardId } from "../../helpers/cards.helper";
import { hoboCards } from "../heroes/hoboCards.data";
import { alchemistLedgerCards } from "../monsters/alchemistLedgerCards.data";

export const recklessExperiment =
	<C extends AIBattleUnit>(
		get: StoreGet,
		set: StoreSet,
		isSimulation = false,
	) =>
	async ({ caster }: EffectResolverParams<C>) => {
		const { heroes, monsters, summons } = get();
		const allUnits = [...heroes, ...monsters, ...summons];
		const oppositeFaction = allUnits.filter(areEnemies(caster));
		const activeHeroes = heroes.filter((h) => h.currentHp > 0);

		if (activeHeroes.length === 0) return;

		// --- GRID BOUNDS ---
		const isBorder = ({ col, row }: GridPosition) =>
			col === GRID_BOUNDS.cols - 1 || row === GRID_BOUNDS.rows - 1;

		// --- STEP 1: MOVE TO THE PERIMETER ---
		const reachableCells = calculateReachableCells({
			movingUnit: caster,
			blockingFigures: oppositeFaction,
			canTargetSelf: true,
		}).filter(isTileEmpty(allUnits));

		let finalPos = caster.gridPosition;

		if (reachableCells.length > 0) {
			let bestScore = -Infinity;

			for (const cell of reachableCells) {
				let score = 0;

				// Massive reward for being on the edge of the map
				if (isBorder(cell)) score += 100;

				if (score > bestScore) {
					bestScore = score;
					finalPos = cell;
				}
			}

			const path = calculateExactPath({
				movingUnit: caster,
				targetPos: finalPos,
				figures: oppositeFaction,
			});
			await moveBattleUnit(
				get,
				set,
				isSimulation,
			)({ movingUnit: caster, path });
		}

		// --- STEP 2: SPAWN VIAL TOWARDS CLOSEST HERO ---
		// Find the closest hero from the new position
		const closestHero = activeHeroes.sort(
			(a, b) =>
				getDistanceToBoundingBox({
					caster: a,
					target: { gridPosition: finalPos },
				}) -
				getDistanceToBoundingBox({
					caster: b,
					target: { gridPosition: finalPos },
				}),
		)[0];

		// Find all empty adjacent tiles
		const currentUnits = [...get().heroes, ...get().monsters, ...get().summons];
		const adjacentOffsets = [
			{ col: 0, row: -1 },
			{ col: 1, row: 0 },
			{ col: 0, row: 1 },
			{ col: -1, row: 0 },
		];
		const emptyAdjacentTiles = adjacentOffsets
			.map((offset) => ({
				col: finalPos.col + offset.col,
				row: finalPos.row + offset.row,
			}))
			.filter(
				(pos) =>
					isTileInBounds(pos) &&
					isTileEmpty(currentUnits)(pos) &&
					!isBorder(pos),
			)
			.sort(
				(a, b) =>
					getDistanceToBoundingBox({
						caster: closestHero,
						target: { gridPosition: a },
					}) -
					getDistanceToBoundingBox({
						caster: closestHero,
						target: { gridPosition: b },
					}),
			);

		if (emptyAdjacentTiles.length > 0) {
			const spawnTile = emptyAdjacentTiles[0];

			// Force the AI to spawn the vial on our perfectly calculated tile
			const spawnVialCard = alchemistLedgerCards[cardId("spawn_vial")];
			const targetSpawnTile: AnchorResolver = () => spawnTile;

			await handleAICardIntent(
				get,
				set,
				isSimulation,
			)({
				attackerId: caster.id,
				card: spawnVialCard,
				getAnchor: targetSpawnTile,
			});

			// --- STEP 3: KICK THE VIAL ---
			// Re-fetch summons to get the newly spawned vial
			const currentSummons = get().summons;
			const targetToKick = currentSummons.find(
				(s) =>
					s.name === acidFlask.name &&
					s.currentHp > 0 &&
					s.gridPosition.col === spawnTile.col &&
					s.gridPosition.row === spawnTile.row,
			);

			if (targetToKick) {
				const targetAdjacentUnit: TargetResolver = () => ({
					reachableTarget: targetToKick,
					moveDest: finalPos,
					canHit: true,
				});

				const kickVialCard = alchemistLedgerCards[cardId("kick_vial")];
				await handleAICardIntent(
					get,
					set,
					isSimulation,
				)({
					attackerId: caster.id,
					card: kickVialCard,
					getTarget: targetAdjacentUnit,
				});
			}
		} else {
			const ironClub = hoboCards[cardId("iron_club")];
			await handleAICardIntent(
				get,
				set,
				isSimulation,
			)({
				attackerId: caster.id,
				card: ironClub,
			});
		}
	};
