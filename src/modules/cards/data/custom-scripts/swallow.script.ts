import { handleAICardIntent } from "@/modules/battle/helpers/ai.actions.helpers";
import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	calculateAttackableCells,
	isTileInBounds,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import {
	applyCombatUpdate,
	updateUnitState,
} from "@/modules/battle/helpers/state.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import {
	type AIBattleUnit,
	type BattleUnit,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { sleep } from "@/modules/shared/helpers/sleep";
import { cardId } from "../../helpers/cards.helper";
import { goliathToadCards } from "../monsters/sewerContaminationCards.data";

export async function triggerRegurgitation(
	get: StoreGet,
	set: StoreSet,
	isSimulation: boolean,
	toad: BattleUnit,
) {
	const state = get();
	const allFigures = [...state.heroes, ...state.monsters, ...state.summons];

	const swallowedHero = state.heroes.find(
		(h) => h.currentHp > 0 && h.statuses.some((s) => s.type === "swallowed"),
	);
	if (!swallowedHero) return;

	const perimeterTiles = calculateAttackableCells({
		attacker: toad,
		rangeValue: 1,
	});
	let spitTile = toad.gridPosition;
	for (const tile of perimeterTiles) {
		if (!isTileInBounds(tile)) continue;

		const isOccupied = allFigures.some(
			(f) => f.currentHp > 0 && isUnitInTile(tile)(f),
		);

		if (!isOccupied) {
			spitTile = tile;
			break;
		}
	}

	await updateUnitState(
		get,
		set,
		isSimulation,
	)(toad.id, {
		stance: UnitStance.ATTACKING,
	});
	await sleep(isSimulation ? 0 : 200);

	await updateUnitState(
		get,
		set,
		isSimulation,
	)(swallowedHero.id, {
		gridPosition: spitTile,
	});
	await updateUnitState(
		get,
		set,
		isSimulation,
	)(toad.id, {
		stance: UnitStance.IDLE,
	});

	const heroNextStatuses = swallowedHero.statuses.filter(
		(s) => s.type !== "swallowed",
	);

	await applyCombatUpdate(
		get,
		set,
		isSimulation,
	)(swallowedHero.id, {
		replaceStatuses: heroNextStatuses,
		newStatuses: [{ type: "vulnerable", amount: 1, duration: 2 }],
	});
}

export const swallow =
	<C extends AIBattleUnit>(
		get: StoreGet,
		set: StoreSet,
		isSimulation = false,
	) =>
	async ({ caster, targetIds }: EffectResolverParams<C>) => {
		// GUARD 1: Is the toad already full?
		if (caster.statuses.some((s) => s.type === "digesting")) {
			const card = goliathToadCards[cardId("giant_chomp")];
			await handleAICardIntent(
				get,
				set,
				isSimulation,
			)({
				attackerId: caster.id,
				card,
			});
			return;
		}

		const { heroes } = get();
		const targetHero = heroes.find((h) => h.id === targetIds[0]);
		if (!targetHero || targetHero.currentHp <= 0) {
			return;
		}

		// 1. BOARD UPDATE: Banish the Hero to the shadow realm (coordinates [-1, -1])
		const bellyUpdate = {
			gridPosition: { col: -1, row: -1 },
		};
		await updateUnitState(get, set, isSimulation)(targetHero.id, bellyUpdate);

		// 2. COMBAT UPDATE: Apply the 'swallowed' acid-tick status to the Hero
		await applyCombatUpdate(
			get,
			set,
			isSimulation,
		)(targetHero.id, {
			newStatuses: [{ type: "swallowed", duration: 3, amount: 3 }],
		});

		// 3. COMBAT UPDATE: Apply the 'digesting' HP-threshold status to the Toad
		await applyCombatUpdate(
			get,
			set,
			isSimulation,
		)(caster.id, {
			newStatuses: [{ type: "digesting", duration: -1, amount: 12 }],
		});
	};
