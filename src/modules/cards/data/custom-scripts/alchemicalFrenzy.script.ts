import {
	type AnchorResolver,
	handleAICardIntent,
	type TargetResolver,
} from "@/modules/battle/helpers/ai.actions.helpers";
import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	calculateReachableCells,
	GRID_BOUNDS,
	getDistanceToBoundingBox,
	getLineOfSightPath,
	isTileEmpty,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import { getSimulationState } from "@/modules/battle/helpers/simulation.helper";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { AIBattleUnit } from "@/modules/figures/domain/figures.type";
import { cardId } from "../../helpers/cards.helper";
import { alchemistLedgerCards } from "../monsters/alchemistLedgerCards.data";

export const getBarnabyStateScore = (
	fakeGet: StoreGet,
	realGet: StoreGet,
): number => {
	const { heroes: oldHeroes } = realGet();
	const { heroes: newHeroes } = fakeGet();

	let score = 0;

	for (const oldHero of oldHeroes) {
		const newHero = newHeroes.find((h) => h.id === oldHero.id);
		if (newHero) {
			const hpDiff = oldHero.currentHp - Math.max(0, newHero.currentHp);
			score += hpDiff * 10;
		}
	}

	return score;
};

export const alchemicalFrenzy =
	<C extends AIBattleUnit>(
		get: StoreGet,
		set: StoreSet,
		isSimulation = false,
	) =>
	async ({ caster }: EffectResolverParams<C>) => {
		const { heroes, monsters, summons } = get();
		const allUnits = [...heroes, ...monsters, ...summons];
		const activeHeroes = heroes.filter((h) => h.currentHp > 0);

		if (activeHeroes.length === 0) return;

		const chargeCard = alchemistLedgerCards[cardId("reckless_charge")];

		const reachableCells = calculateReachableCells({
			movingUnit: caster,
			blockingFigures: activeHeroes,
			canTargetSelf: true,
		}).filter(isTileEmpty(allUnits));

		reachableCells.push(caster.gridPosition);

		let bestScore = -Infinity;
		let bestStartPos = caster.gridPosition;
		let bestTargetPos = caster.gridPosition;

		// --- SHADOW STATE: SCORING EVERY POSSIBLE CHARGE ---
		const heroPositions = activeHeroes.map(({ gridPosition }) => gridPosition);
		for (const startPos of reachableCells) {
			for (const { col, row } of heroPositions) {
				const dx = Math.sign(col - startPos.col);
				const dy = Math.sign(row - startPos.row);

				const path = getLineOfSightPath(startPos, {
					col: startPos.col + GRID_BOUNDS.cols * dx,
					row: startPos.row + GRID_BOUNDS.rows * dy,
				}).filter(isTileInBounds);
				const targetPos = path[path.length - 1];

				const { fakeGet, fakeSet } = getSimulationState(get);

				const fakeBarnaby = fakeGet().monsters.find((m) => m.id === caster.id);
				if (fakeBarnaby) fakeBarnaby.gridPosition = startPos;

				const targetResolver: TargetResolver = () => ({
					reachableTarget: { gridPosition: targetPos },
					moveDest: startPos,
					canHit: true,
				});
				const anchorResolver: AnchorResolver = () => ({
					gridPosition: targetPos,
				});

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

				const score = getBarnabyStateScore(fakeGet, get);
				const finalScore =
					score -
					getDistanceToBoundingBox({
						caster,
						target: { gridPosition: startPos },
					}) *
						0.1;

				if (finalScore > bestScore) {
					bestScore = finalScore;
					bestStartPos = startPos;
					bestTargetPos = targetPos;
				}
			}
		}

		// Execute the optimal charge
		const finalTargetResolver: TargetResolver = () => ({
			reachableTarget: { gridPosition: bestTargetPos },
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
