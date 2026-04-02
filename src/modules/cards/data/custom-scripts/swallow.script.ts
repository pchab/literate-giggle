import { handleAICardIntent } from "@/modules/battle/helpers/ai.actions.helpers";
import type { EffectResolver } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	isTileInBounds,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import { calculateAttackableCells } from "@/modules/battle/helpers/move.helpers";
import {
	applyCombatUpdate,
	updateUnitState,
} from "@/modules/battle/helpers/state.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { sleep } from "@/modules/shared/helpers/sleep";
import { type BattleUnit, UnitStance } from "@/modules/units/domain/units.type";
import type { CustomScriptEffect } from "../../domain/cards.type";
import { cardId } from "../../helpers/cards.helper";
import { goliathToadCards } from "../monsters/sewerContaminationCards.data";

export async function triggerRegurgitation(
	get: StoreGet,
	set: StoreSet,
	isSimulation: boolean,
	toad: BattleUnit,
) {
	const { units: allUnits, gridSize } = get();

	const swallowedHero = allUnits.find(
		(h) => h.currentHp > 0 && h.statuses.some((s) => s.type === "swallowed"),
	);
	if (!swallowedHero) return;

	const perimeterTiles = calculateAttackableCells({
		attacker: toad,
		rangeValue: 1,
		gridSize,
	});
	let spitTile = toad.gridPosition;
	for (const tile of perimeterTiles) {
		if (!isTileInBounds(gridSize)(tile)) continue;

		const isOccupied = allUnits.some(
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

export const swallow: EffectResolver<BattleUnit, CustomScriptEffect<void>> =
	(get, set, isSimulation = false) =>
	(_) =>
	async ({ caster, targetIds }) => {
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

		const { units } = get();
		const targetHero = units.find((h) => h.id === targetIds[0]);
		if (!targetHero || targetHero.currentHp <= 0) {
			return;
		}

		// --- Banish the Hero to the shadow realm (coordinates [-1, -1])
		const bellyUpdate = {
			gridPosition: { col: -1, row: -1 },
		};
		await updateUnitState(get, set, isSimulation)(targetHero.id, bellyUpdate);
	};
