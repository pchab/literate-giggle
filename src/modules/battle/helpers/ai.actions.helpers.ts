import {
	filterGridByAttackPattern,
	getClosestOriginTile,
	getDistanceToBoundingBox,
} from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import type { Card } from "@/modules/cards/domain/cards.type";
import {
	type AIBattleUnit,
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import {
	isHero,
	isMonster,
	isSummon,
} from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";
import { getIdealTarget } from "./ai.move.helpers";
import {
	type AnchorResolver,
	getAnchorTarget,
	type TargetResolver,
} from "./ai.targeting.helpers";
import { resolveTargets } from "./effects/effect.helpers";
import { resolvers } from "./effects/effect.resolvers";
import { calculateExactPath, moveBattleUnit } from "./move.helpers";
import { updateUnitState } from "./state.helpers";

export const handleAICardIntent =
	(get: StoreGet, set: StoreSet, isSimulation = false) =>
	async ({
		attackerId,
		card,
		getTarget = getIdealTarget,
		getAnchor = getAnchorTarget,
	}: {
		attackerId: BattleUnit["id"];
		card: Card;
		getTarget?: TargetResolver;
		getAnchor?: AnchorResolver;
	}) => {
		const { units } = get(); // Unified array!
		const initialAttacker = units.find((u) => u.id === attackerId) as
			| AIBattleUnit
			| undefined;

		if (!initialAttacker) return;

		const { reachableTarget, moveDest } = getTarget(
			initialAttacker,
			card,
			units,
		);
		if (!reachableTarget || !moveDest) return;

		// ==========================================
		// 1. ANIMATE THE WALK
		// ==========================================
		const isNeutral =
			isSummon(initialAttacker) && initialAttacker.allegiance === "NEUTRAL";
		const isPlayerAligned =
			isSummon(initialAttacker) && initialAttacker.allegiance === "PLAYER";

		const blockingFigures = units.filter((f) => {
			if (f.id === initialAttacker.id) return false;
			if (isNeutral) return true;

			if (isPlayerAligned) {
				return isMonster(f) || (isSummon(f) && f.allegiance !== "PLAYER");
			}

			return isHero(f) || (isSummon(f) && f.allegiance !== "ENEMY");
		});

		const path = calculateExactPath({
			movingUnit: initialAttacker,
			targetPos: moveDest,
			figures: blockingFigures,
		});

		const movedUnit = await moveBattleUnit(
			get,
			set,
			isSimulation,
		)({
			movingUnit: initialAttacker,
			path,
		});

		if (isSimulation) {
			set(({ aiIntents, ...prev }) => {
				const unitIntent = aiIntents[initialAttacker.id];
				if (unitIntent) {
					unitIntent.intendedMove = path;
				}
				return { aiIntents, ...prev };
			});
		}

		// ==========================================
		// 2. PREPARE THE ATTACK
		// ==========================================
		// Guard: Did they die to an Acid Trap during the walk?
		if (!movedUnit || (movedUnit.currentHp <= 0 && !movedUnit.isDeathRattle)) {
			return;
		}

		const distanceToTarget = getDistanceToBoundingBox({
			caster: movedUnit,
			target: reachableTarget,
		});

		if (card.aiTargetPreference !== "self" && distanceToTarget > card.range) {
			return;
		}

		const postMoveUnits = get().units;

		const anchorTarget = getAnchor({
			attacker: movedUnit,
			card,
			reachableTarget,
			obstacles: postMoveUnits,
		});

		const attackOrigin = getClosestOriginTile({
			caster: movedUnit,
			anchorTarget,
		});

		const targetedCells = filterGridByAttackPattern({
			card,
			targetPos: anchorTarget,
			originPos: attackOrigin,
		});

		if (isSimulation) {
			set(({ aiIntents, ...prev }) => {
				const unitIntent = aiIntents[initialAttacker.id];
				if (unitIntent) {
					unitIntent.dangerZone = targetedCells;
					unitIntent.target = anchorTarget;
				}
				return { aiIntents, ...prev };
			});
		}

		// ==========================================
		// 3. RESOLVE EFFECTS
		// ==========================================
		await updateUnitState(
			get,
			set,
			isSimulation,
		)(attackerId, {
			stance: UnitStance.ATTACKING,
		});
		await sleep(isSimulation ? 0 : 200);

		const lockedTargets = card.effects.map((effect) =>
			resolveTargets(
				effect.target,
				anchorTarget,
				movedUnit,
				postMoveUnits,
				targetedCells,
			),
		);

		for (let i = 0; i < card.effects.length; i++) {
			const effect = card.effects[i];
			await resolvers(effect)(get, set, isSimulation)({
				anchorTarget,
				caster: movedUnit,
				patternCells: targetedCells,
				targetIds: lockedTargets[i],
			});
		}

		await updateUnitState(
			get,
			set,
			isSimulation,
		)(attackerId, {
			stance: UnitStance.IDLE,
		});
	};
