import type { GridPosition } from "@/modules/battle/domain/grid.type";
import type { EffectResolver } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	getCellId,
	getDistanceToBoundingBox,
	isTileEmpty,
	isTileInBounds,
	isUnitInTile,
} from "@/modules/battle/helpers/grid.helpers";
import { moveBattleUnit } from "@/modules/battle/helpers/move.helpers";
import { applyCombatUpdate } from "@/modules/battle/helpers/state.helpers";
import { lockedZone } from "@/modules/battle/helpers/telegraph.helpers";
import { transformCountdown } from "@/modules/battle/helpers/transform.helpers";
import type { BattleSet } from "@/modules/battle/store/battle.store";
import { sleep } from "@/modules/shared/helpers/sleep";
import { summonLibrary } from "@/modules/units/data/summons/summons.data";
import {
	type BattleUnit,
	type Summon,
	UnitStance,
} from "@/modules/units/domain/units.type";
import {
	getVariantFromBlueprint,
	isHero,
	summonId,
} from "@/modules/units/helpers/units.helpers";
import type { CustomScriptEffect } from "../../domain/cards.type";

/** Shows a blunt impact on each cell (real turns only). */
const impact = (set: BattleSet, cells: GridPosition[]) =>
	set((prev) => ({
		currentVfx: {
			...prev.currentVfx,
			...Object.fromEntries(
				cells.map((c) => [getCellId(c), { type: "BLUNT" as const }]),
			),
		},
	}));

/**
 * Bring Down the Ceiling: marks the tiles under the closest heroes. Next turn rocks
 * fall there: true damage to whatever stands on them (heroes, or the Golem if it was
 * pushed in), then a boulder lands on each tile left empty.
 */
export const ceilingCollapse: EffectResolver<
	BattleUnit,
	CustomScriptEffect<{ tiles: number; damage: number; boulderId: string }>
> =
	(get, set, isSimulation = false) =>
	({ payload }) =>
	async ({ caster }) => {
		const zone = lockedZone(
			get,
			set,
			isSimulation,
		)(caster.id, () =>
			get()
				.units.filter((u) => isHero(u) && u.currentHp > 0)
				.sort(
					(a, b) =>
						getDistanceToBoundingBox({ caster, target: a }) -
						getDistanceToBoundingBox({ caster, target: b }),
				)
				.slice(0, payload.tiles)
				.map((h) => ({ ...h.gridPosition })),
		);

		if (!isSimulation) {
			impact(set, zone);
			await sleep(500);
		}

		const hit = new Set<string>();
		for (const cell of zone) {
			const victim = get().units.find(
				(u) => u.currentHp > 0 && isUnitInTile(cell)(u),
			);
			if (!victim || hit.has(victim.id)) continue;
			hit.add(victim.id);
			await applyCombatUpdate(
				get,
				set,
				isSimulation,
			)(victim.id, {
				damageTaken: payload.damage,
				isTrueDamage: true,
				sourceId: caster.id,
			});
		}

		const blueprint = summonLibrary[payload.boulderId];
		if (!blueprint) return;
		const { gridSize, removedCells } = get();
		const landing = zone.filter(
			(cell) =>
				isTileInBounds(gridSize, removedCells)(cell) &&
				isTileEmpty(get().units)(cell),
		);
		const boulders: Summon[] = landing.map((cell, i) => ({
			...blueprint,
			id: summonId(`boulder-${Date.now()}-${i}`),
			variant: getVariantFromBlueprint(blueprint),
			stance: UnitStance.IDLE,
			currentHp: blueprint.maxHp,
			statuses: [],
			gridPosition: cell,
			allegiance: "NEUTRAL",
			...transformCountdown(blueprint),
		}));
		if (boulders.length)
			set((prev) => ({ units: [...prev.units, ...boulders] }));
	};

/**
 * Seismic Slam: marks every tile within `radius` of the Golem. Next turn the floor
 * cracks there: damage to anything still in the zone, the Golem's allies included.
 */
export const seismicSlam: EffectResolver<
	BattleUnit,
	CustomScriptEffect<{ radius: number; damage: number }>
> =
	(get, set, isSimulation = false) =>
	({ payload }) =>
	async ({ caster }) => {
		const zone = lockedZone(
			get,
			set,
			isSimulation,
		)(caster.id, () => {
			const { gridSize, removedCells } = get();
			const cells: GridPosition[] = [];
			for (let row = 0; row < gridSize.rows; row++) {
				for (let col = 0; col < gridSize.cols; col++) {
					const cell = { col, row };
					const d = getDistanceToBoundingBox({
						caster: { gridPosition: cell },
						target: caster,
					});
					if (
						d > 0 &&
						d <= payload.radius &&
						isTileInBounds(gridSize, removedCells)(cell)
					) {
						cells.push(cell);
					}
				}
			}
			return cells;
		});

		if (!isSimulation) {
			impact(set, zone);
			await sleep(400);
		}

		const victims = get().units.filter(
			(u) =>
				u.id !== caster.id &&
				u.currentHp > 0 &&
				zone.some((cell) => isUnitInTile(cell)(u)),
		);
		for (const victim of victims) {
			await applyCombatUpdate(
				get,
				set,
				isSimulation,
			)(victim.id, {
				damageTaken: payload.damage,
				sourceId: caster.id,
				isDirectHit: true,
			});
		}
	};

/**
 * Advance: after acting, the boss walks up to `steps` tiles toward the nearest hero
 * (ties go toward the centre of the board), so its next telegraph lands where the
 * party is. Boulders and units block the way.
 */
export const advance: EffectResolver<
	BattleUnit,
	CustomScriptEffect<{ steps: number }>
> =
	(get, set, isSimulation = false) =>
	({ payload }) =>
	async ({ caster }) => {
		const { units, gridSize, removedCells } = get();
		const self = units.find((u) => u.id === caster.id);
		const heroes = units.filter((u) => isHero(u) && u.currentHp > 0);
		if (!self || self.currentHp <= 0 || !heroes.length) return;

		const key = (c: GridPosition) => getCellId(c);
		const distToHeroes = (c: GridPosition) =>
			Math.min(
				...heroes.map((h) =>
					getDistanceToBoundingBox({ caster: { gridPosition: c }, target: h }),
				),
			);
		const centre = {
			col: (gridSize.cols - 1) / 2,
			row: (gridSize.rows - 1) / 2,
		};
		const distToCentre = (c: GridPosition) =>
			Math.abs(c.col - centre.col) + Math.abs(c.row - centre.row);

		// Breadth-first over empty tiles, up to `steps` away.
		const from = new Map<string, GridPosition | null>([
			[key(self.gridPosition), null],
		]);
		let frontier = [self.gridPosition];
		for (let step = 0; step < payload.steps; step++) {
			const next: GridPosition[] = [];
			for (const cell of frontier) {
				for (const [dc, dr] of [
					[1, 0],
					[-1, 0],
					[0, 1],
					[0, -1],
				]) {
					const n = { col: cell.col + dc, row: cell.row + dr };
					if (from.has(key(n))) continue;
					if (!isTileInBounds(gridSize, removedCells)(n)) continue;
					if (!isTileEmpty(units)(n)) continue;
					from.set(key(n), cell);
					next.push(n);
				}
			}
			frontier = next;
		}

		const options = [...from.keys()].map((id) => {
			const [row, col] = id.split("-").map(Number);
			return { col, row };
		});
		const best = options.sort(
			(a, b) =>
				distToHeroes(a) - distToHeroes(b) || distToCentre(a) - distToCentre(b),
		)[0];
		if (!best || key(best) === key(self.gridPosition)) return;
		// Already next to a hero: stay put.
		if (distToHeroes(self.gridPosition) <= distToHeroes(best)) return;

		const path: GridPosition[] = [];
		for (
			let at: GridPosition | null = best;
			at && key(at) !== key(self.gridPosition);
		) {
			path.unshift(at);
			at = from.get(key(at)) ?? null;
		}
		await moveBattleUnit(get, set, isSimulation)({ movingUnit: self, path });
	};
