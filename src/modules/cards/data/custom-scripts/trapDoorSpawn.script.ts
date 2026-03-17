import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import {
	getCellId,
	isTileEmpty,
	isTileInBounds,
} from "@/modules/battle/helpers/grid.helpers";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { summonLibrary } from "@/modules/figures/data/summons/summons.data";
import {
	type BattleUnit,
	type Summon,
	UnitStance,
} from "@/modules/figures/domain/figures.type";
import { summonId } from "@/modules/figures/helpers/figures.helpers";
import { sleep } from "@/modules/shared/helpers/sleep";

export const trapdoorSpawn =
	<C extends BattleUnit>(get: StoreGet, set: StoreSet) =>
	async (
		{ caster }: EffectResolverParams<C>,
		payload: { spawnCount: number; blueprintId: Summon["id"] },
	) => {
		const { heroes, monsters, summons, surfaces } = get();
		const figures = [...heroes, ...monsters, ...summons];

		const targetPos = { col: 2, row: 2 };

		const isBlocked = !isTileEmpty(figures)(targetPos);

		if (isBlocked) {
			console.log("Trap door blocked! Rat King enrages.");

			// Example: Heal the boss for 5 HP if blocked
			set((prev) => ({
				...prev,
				monsters: prev.monsters.map((m) =>
					m.id === caster.id
						? { ...m, currentHp: Math.min(m.maxHp, m.currentHp + 5) }
						: m,
				),
			}));
			return;
		}

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
		await sleep(500);

		const neighbors = [
			{ col: targetPos.col, row: targetPos.row - 1 },
			{ col: targetPos.col, row: targetPos.row + 1 },
			{ col: targetPos.col - 1, row: targetPos.row },
			{ col: targetPos.col + 1, row: targetPos.row },
		];

		const validSpawns = neighbors
			.filter(isTileInBounds)
			.filter(isTileEmpty(figures));

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
			summons: [...prev.summons, ...newRats],
			surfaces: {
				...surfaces,
				[getCellId(targetPos)]: {
					...trapdoorSurface,
					spriteBase: "/surfaces/closed_trapdoor.webp",
				},
			},
		}));
	};
