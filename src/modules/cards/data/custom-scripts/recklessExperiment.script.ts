import type { GridPosition } from "@/modules/battle/domain/grid.type";
import {
	type AnchorResolver,
	handleAICardIntent,
	type TargetResolver,
} from "@/modules/battle/helpers/ai.actions.helpers";
import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	GRID_BOUNDS,
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
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
			const {
				[cardId("spawn_vial")]: spawnVialCard,
				[cardId("kick_vial")]: kickVialCard,
			} = alchemistLedgerCards;

			const { heroes } = get();
			const activeHeroes = heroes.filter((h) => h.currentHp > 0);

			if (activeHeroes.length === 0) return;

			// --- GRID BOUNDS ---
			const isBorder = ({ col, row }: GridPosition) =>
				col === GRID_BOUNDS.cols - 1 || row === GRID_BOUNDS.rows - 1;

			// --- STEP 1: SPAWN VIAL TOWARDS CLOSEST HERO ---
			// Find the closest hero from the new position
			const closestHero = activeHeroes.sort(
				(a, b) =>
					getDistanceToBoundingBox({
						caster,
						target: a,
					}) -
					getDistanceToBoundingBox({
						caster,
						target: b,
					}),
			)[0];

			// Find all empty adjacent tiles
			const currentUnits = [...get().heroes, ...get().monsters, ...get().summons];;

			const getVialLandingSpot = (spawnTile: GridPosition): GridPosition => {
				const dx = Math.sign(spawnTile.col - caster.gridPosition.col);
				const dy = Math.sign(spawnTile.row - caster.gridPosition.row);

				let currentX = spawnTile.col;
				let currentY = spawnTile.row;

				const pushDistance = kickVialCard.effects.find((effect) => effect.type === "push")?.distance ?? 2;

				for (let i = 0; i < pushDistance; i++) {
					const nextPos = { col: currentX + dx, row: currentY + dy };

					if (!isTileInBounds(nextPos) || !isTileEmpty(currentUnits)(nextPos)) {
						break;
					}
					currentX = nextPos.col;
					currentY = nextPos.row;
				}

				return { col: currentX, row: currentY };
			};

			const adjacentOffsets = [
				{ col: 0, row: -1 },
				{ col: 1, row: 0 },
				{ col: 0, row: 1 },
				{ col: -1, row: 0 },
			];
			const emptyAdjacentTiles = adjacentOffsets
				.map((offset) => ({
					col: caster.gridPosition.col + offset.col,
					row: caster.gridPosition.row + offset.row,
				}))
				.filter(
					(pos) =>
						isTileInBounds(pos) &&
						isTileEmpty(currentUnits)(pos) &&
						!isBorder(pos),
				);

			const sortedSpawnTiles = emptyAdjacentTiles.sort((spawnA, spawnB) => {
				const landingA = getVialLandingSpot(spawnA);
				const landingB = getVialLandingSpot(spawnB);

				const distA = getDistanceToBoundingBox({
					caster: closestHero,
					target: { gridPosition: landingA },
				});
				const distB = getDistanceToBoundingBox({
					caster: closestHero,
					target: { gridPosition: landingB },
				});

				if (distA === distB) {
					const travelA = Math.abs(landingA.col - spawnA.col) + Math.abs(landingA.row - spawnA.row);
					const travelB = Math.abs(landingB.col - spawnB.col) + Math.abs(landingB.row - spawnB.row);
					return travelB - travelA;
				}

				return distA - distB;
			});

			if (sortedSpawnTiles.length > 0) {
				const spawnTile = sortedSpawnTiles[0];

				const targetSpawnTile: AnchorResolver = () => ({
					gridPosition: spawnTile,
				});

				await handleAICardIntent(
					get,
					set,
					isSimulation,
				)({
					attackerId: caster.id,
					card: spawnVialCard,
					getAnchor: targetSpawnTile,
				});

				// --- STEP 2: KICK THE VIAL ---
				const currentSummons = get().summons;
				const targetToKick = currentSummons.find(isUnitInTile(spawnTile));

				if (targetToKick) {
					const targetAdjacentUnit: TargetResolver = () => ({
						reachableTarget: targetToKick,
						moveDest: caster.gridPosition,
						canHit: true,
					});

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
