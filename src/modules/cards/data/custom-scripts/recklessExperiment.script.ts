import type { GridPosition } from "@/modules/battle/domain/grid.type";
import { handleAICardIntent } from "@/modules/battle/helpers/ai.actions.helpers";
import type {
	AnchorResolver,
	TargetResolver,
} from "@/modules/battle/helpers/ai.targeting.helpers";
import type { EffectResolver } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import { goblinShaman } from "@/modules/figures/data/monsters/goblin.data";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import { isHero } from "@/modules/figures/helpers/figures.helpers";
import type { CustomScriptEffect } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { hoboCards } from "../heroes/hoboCards.data";
import { alchemistLedgerCards } from "../monsters/alchemistLedgerCards.data";

export const recklessExperiment: EffectResolver<
	BattleUnit,
	CustomScriptEffect<void>
> =
	(get, set, isSimulation = false) =>
	(_) =>
	async ({ caster }) => {
		const {
			[cardId("spawn_vial")]: spawnVialCard,
			[cardId("kick_vial")]: kickVialCard,
		} = alchemistLedgerCards;
		const ironClub = hoboCards[cardId("iron_club")];

		const { units, gridSize } = get();
		const activeHeroes = units.filter(isHero).filter((h) => h.currentHp > 0);

		if (activeHeroes.length === 0) return;

		const shaman = units.find(({ name }) => name === goblinShaman.name);
		if (!shaman) {
			return handleAICardIntent(
				get,
				set,
				isSimulation,
			)({
				attackerId: caster.id,
				card: ironClub,
			});
		}

		// --- GRID BOUNDS ---
		const isBorder = ({ col, row }: GridPosition) =>
			col === gridSize.cols - 1 || row === gridSize.rows - 1;

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
		const { units: currentUnits } = get();

		const getVialLandingSpot = (spawnTile: GridPosition): GridPosition => {
			const dx = Math.sign(spawnTile.col - caster.gridPosition.col);
			const dy = Math.sign(spawnTile.row - caster.gridPosition.row);

			let currentX = spawnTile.col;
			let currentY = spawnTile.row;

			const pushDistance =
				kickVialCard.effects.find((effect) => effect.type === "push")
					?.distance ?? 2;

			for (let i = 0; i < pushDistance; i++) {
				const nextPos = { col: currentX + dx, row: currentY + dy };

				if (
					!isTileInBounds(gridSize)(nextPos) ||
					!isTileEmpty(currentUnits)(nextPos)
				) {
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
					isTileInBounds(gridSize)(pos) &&
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
				const travelA =
					Math.abs(landingA.col - spawnA.col) +
					Math.abs(landingA.row - spawnA.row);
				const travelB =
					Math.abs(landingB.col - spawnB.col) +
					Math.abs(landingB.row - spawnB.row);
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
			const targetToKick = get().units.find(isUnitInTile(spawnTile));

			if (targetToKick) {
				const targetAdjacentUnit: TargetResolver = () => () => ({
					intendedTarget: targetToKick,
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
