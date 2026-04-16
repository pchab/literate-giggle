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
} from "@/modules/battle/helpers/grid.helpers";
import {
	calculateReachableCells,
	getLineOfSightPath,
} from "@/modules/battle/helpers/move.helpers";
import { getSimulationState } from "@/modules/battle/helpers/simulation.helper";
import type { BattleGet } from "@/modules/battle/store/battle.store";
import type { BattleUnit } from "@/modules/units/domain/units.type";
import { isHero } from "@/modules/units/helpers/units.helpers";
import type { CustomScriptEffect } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { alchemistLedgerCards } from "../monsters/alchemistLedgerCards.data";

const getBarnabyStateScore = (
	fakeGet: BattleGet,
	realGet: BattleGet,
): number => {
	const { units: oldUnits } = realGet();
	const { units: newUnits } = fakeGet();
	const oldHeroes = oldUnits.filter(isHero);
	const newHeroes = newUnits.filter(isHero);

	let score = 0;
	for (const oldHero of oldHeroes) {
		const newHero = newHeroes.find((h) => h.id === oldHero.id);
		const newHp = newHero ? Math.max(0, newHero.currentHp) : 0;

		const hpDiff = oldHero.currentHp - newHp;
		score += hpDiff;

		if (!newHero || newHp === 0) {
			score += 50; // Barnaby loves a good murder
		}
	}

	return score;
};

export const alchemicalFrenzy: EffectResolver<
	BattleUnit,
	CustomScriptEffect<void>
> =
	(get, set, isSimulation = false) =>
	(_) =>
	async ({ caster }) => {
		const { units, gridSize, removedCells } = get();
		const activeHeroes = units.filter(isHero).filter((h) => h.currentHp > 0);

		if (activeHeroes.length === 0) return;

		const chargeCard = alchemistLedgerCards[cardId("reckless_charge")];

		const reachableCells = calculateReachableCells({
			movingUnit: caster,
			blockingUnits: activeHeroes,
			canTargetSelf: true,
			gridSize,
			removedCells,
		}).filter(isTileEmpty(units));

		reachableCells.push(caster.gridPosition);

		let bestScore = -Infinity;
		let bestStartPos = caster.gridPosition;
		let bestTargetPos = caster.gridPosition;

		const heroPositions = activeHeroes.map(({ gridPosition }) => gridPosition);

		// --- SHADOW STATE: SCORING EVERY POSSIBLE CHARGE ---
		for (const startPos of reachableCells) {
			for (const { col, row } of heroPositions) {
				const dCol = col - startPos.col;
				const dRow = row - startPos.row;

				// GUARD: Optimization & Math Fix!
				// Only evaluate if the start pos is perfectly cardinal or diagonal to the hero.
				// If it isn't, Barnaby can't draw a straight line to them anyway.
				const isAligned =
					dCol === 0 || dRow === 0 || Math.abs(dCol) === Math.abs(dRow);
				if (!isAligned) continue;

				const dx = Math.sign(dCol);
				const dy = Math.sign(dRow);

				const path = getLineOfSightPath(startPos, {
					col: startPos.col + gridSize.cols * dx,
					row: startPos.row + gridSize.rows * dy,
				}).filter(isTileInBounds(gridSize, removedCells));

				const targetPos = path[path.length - 1];

				const { fakeGet, fakeSet } = getSimulationState(get);

				fakeSet(({ units: fakeUnits }) => ({
					units: fakeUnits.map((u) =>
						u.id === caster.id ? { ...u, gridPosition: startPos } : u,
					),
				}));

				const targetResolver: TargetResolver = () => () => ({
					intendedTarget: { gridPosition: targetPos },
					moveDest: startPos,
					canHit: true,
				});
				const anchorResolver: AnchorResolver = () => ({
					gridPosition: targetPos,
				});

				// Run the simulation
				await handleAICardIntent(
					fakeGet,
					fakeSet,
					true,
				)({
					attackerId: caster.id,
					card: chargeCard,
					getTarget: targetResolver,
					getAnchor: anchorResolver,
				});
				const distancePenalty =
					getDistanceToBoundingBox({
						caster,
						target: { gridPosition: startPos },
					}) * 0.1;

				const score = getBarnabyStateScore(fakeGet, get) - distancePenalty;
				if (score > bestScore) {
					bestScore = score;
					bestStartPos = startPos;
					bestTargetPos = targetPos;
				}
			}
		}

		// ==========================================
		// EXECUTE THE OPTIMAL TIMELINE
		// ==========================================
		const finalTargetResolver: TargetResolver = () => () => ({
			intendedTarget: { gridPosition: bestTargetPos },
			moveDest: bestStartPos,
			canHit: true,
		});
		const finalAnchorResolver: AnchorResolver = () => ({
			gridPosition: bestTargetPos,
		});

		await handleAICardIntent(
			get,
			set,
			isSimulation,
		)({
			attackerId: caster.id,
			card: chargeCard,
			getTarget: finalTargetResolver,
			getAnchor: finalAnchorResolver,
		});
	};
