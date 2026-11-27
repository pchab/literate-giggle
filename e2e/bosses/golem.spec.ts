import { expect, test } from "@playwright/test";
import {
	endRound,
	heroesOf,
	moveHero,
	patchUnits,
	playCard,
	readBattle,
	startFightRoomBattle,
	unitNamed,
	waitForBattle,
} from "../support/battle";
import { newGame } from "../support/state";

/**
 * The Golem Overseer, fought from the dev fight room with its default party
 * (Fighter, Mage, Cleric, level 3). Pattern: ceiling → slam → hardened stone;
 * below 50% HP: slam → ceiling.
 */
test.describe("Golem Overseer", () => {
	test.beforeEach(async ({ page }) => {
		await newGame(page);
	});

	test("opens with a bark and a locked ceiling telegraph under the 2 closest heroes", async ({
		page,
	}) => {
		await page.goto("/dev/fights");
		await page
			.getByRole("button", { name: "Fight The Golem Overseer" })
			.click();
		// The bark only lasts a few seconds: catch it as the battle opens.
		await expect(
			page.getByText("INTRUDERS. THE PASSAGE IS SEALED."),
		).toBeVisible({
			timeout: 30_000,
		});
		await waitForBattle(page);

		const { units, intents } = await readBattle(page);
		const golem = unitNamed(units, "Golem Overseer");
		const intent = intents.find((i) => i.unitId === golem.id);
		expect(intent?.cardId).toBe("card-ceiling_collapse");
		expect(intent?.lockedZone).toHaveLength(2);
		const heroCells = heroesOf(units).map((h) => JSON.stringify(h.pos));
		for (const cell of intent?.lockedZone ?? [])
			expect(heroCells).toContain(JSON.stringify(cell));
		await expect(page.locator("[data-telegraph]")).toHaveCount(2);
	});

	test("rocks fall on the marked tiles even after a hero steps out; a boulder lands there", async ({
		page,
	}) => {
		await startFightRoomBattle(page, "The Golem Overseer");
		const start = await readBattle(page);
		const golem = unitNamed(start.units, "Golem Overseer");
		const zone =
			start.intents.find((i) => i.unitId === golem.id)?.lockedZone ?? [];
		const [dodger, stayer] = heroesOf(start.units).filter((h) =>
			zone.some((c) => c.col === h.pos.col && c.row === h.pos.row),
		);
		// Keep the Stone Elemental out of the way so only the Golem acts.
		const elemental = unitNamed(start.units, "Stone Elemental");
		await patchUnits(page, { [elemental.id]: { currentHp: 0 } });

		const free = {
			col: dodger.pos.col === 0 ? 0 : dodger.pos.col - 1,
			row: dodger.pos.row,
		};
		const blocked = start.units.some(
			(u) => u.pos.col === free.col && u.pos.row === free.row,
		);
		await moveHero(
			page,
			dodger.id,
			blocked ? { col: dodger.pos.col, row: dodger.pos.row + 2 } : free,
		);

		const afterMove = await readBattle(page);
		expect(
			afterMove.intents.find((i) => i.unitId === golem.id)?.lockedZone,
		).toEqual(zone);

		await endRound(page);
		const after = await readBattle(page);
		expect(
			unitNamed(after.units, dodger.name).hp,
			"the hero who stepped out",
		).toBe(dodger.hp);
		expect(unitNamed(after.units, stayer.name).hp, "rocks ignore armour").toBe(
			stayer.hp - 5,
		);
		const boulder = after.units.find((u) => u.name === "Boulder");
		expect(boulder?.pos).toEqual(dodger.pos);

		// It walked toward the party after acting...
		const moved = unitNamed(after.units, "Golem Overseer");
		const nearest = (pos: { col: number; row: number }) =>
			Math.min(
				...heroesOf(after.units).map(
					(h) => Math.abs(h.pos.col - pos.col) + Math.abs(h.pos.row - pos.row),
				),
			);
		expect(nearest(moved.pos)).toBeLessThan(nearest(golem.pos));

		// ...and its next move, Seismic Slam, is telegraphed around where it now stands.
		const next = after.intents.find((i) => i.unitId === golem.id);
		expect(next?.cardId).toBe("card-seismic_slam");
		expect(next?.lockedZone?.length).toBeGreaterThan(0);
		for (const cell of next?.lockedZone ?? []) {
			const d =
				Math.abs(cell.col - moved.pos.col) + Math.abs(cell.row - moved.pos.row);
			expect(d).toBeGreaterThan(0);
			expect(d).toBeLessThanOrEqual(2);
		}
	});

	test("a boulder collision deals triple damage that ignores armour", async ({
		page,
	}) => {
		await startFightRoomBattle(page, "The Golem Overseer");
		const { units } = await readBattle(page);
		const golem = unitNamed(units, "Golem Overseer");
		const elemental = unitNamed(units, "Stone Elemental");
		const hero = heroesOf(units)[0];

		// Hero (1,2) → Golem (2,2) → Boulder (3,2): Shove pushes the Golem into the rock.
		await page.evaluate(() => {
			const store = (
				window as unknown as {
					__battleStore: {
						setState(fn: (s: { units: object[] }) => object): void;
					};
				}
			).__battleStore;
			store.setState((s) => ({
				units: [
					...s.units,
					{
						id: "summon-test-boulder",
						name: "Boulder",
						spriteBase: "summons/boulder",
						variant: "default",
						maxHp: 8,
						currentHp: 8,
						baseDef: 0,
						baseMove: 0,
						statuses: [],
						stance: 0,
						intentPool: [],
						allegiance: "NEUTRAL",
						collisionMultiplier: 3,
						gridPosition: { col: 3, row: 2 },
					},
				],
			}));
		});
		await patchUnits(page, {
			[golem.id]: { gridPosition: { col: 2, row: 2 } },
			[elemental.id]: { gridPosition: { col: 4, row: 4 } },
			[hero.id]: { gridPosition: { col: 1, row: 2 } },
		});

		await playCard(page, hero.id, "Shove", { col: 2, row: 2 });
		const after = await readBattle(page);
		expect(
			unitNamed(after.units, "Golem Overseer").hp,
			"1 collision × 3, DEF 2 ignored",
		).toBe(golem.hp - 3);
		expect(unitNamed(after.units, "Boulder").hp).toBe(5);
	});

	test("below 50% HP it barks and switches to its second routine", async ({
		page,
	}) => {
		await startFightRoomBattle(page, "The Golem Overseer");
		const { units } = await readBattle(page);
		const golem = unitNamed(units, "Golem Overseer");
		await patchUnits(page, {
			[golem.id]: { currentHp: Math.floor(golem.maxHp / 2) },
		});

		await endRound(page);
		const after = await readBattle(page);
		const boss = unitNamed(after.units, "Golem Overseer");
		expect(boss.phaseIndex).toBe(1);
		expect(after.intents.find((i) => i.unitId === golem.id)?.cardId).toBe(
			"card-seismic_slam",
		);
		await expect(
			page.getByText("CORE OVERHEATING. ABANDONING DEFENCE."),
		).toBeVisible();
	});
	test("a boulder wakes up as a Rubble Elemental after 2 rounds, keeping its share of HP", async ({
		page,
	}) => {
		await startFightRoomBattle(page, "The Golem Overseer");
		const start = await readBattle(page);
		const golem = unitNamed(start.units, "Golem Overseer");
		const zone =
			start.intents.find((i) => i.unitId === golem.id)?.lockedZone ?? [];
		const dodger = heroesOf(start.units).find((h) =>
			zone.some((c) => c.col === h.pos.col && c.row === h.pos.row),
		);
		if (!dodger) throw new Error("no hero on a marked tile");
		const elemental = unitNamed(start.units, "Stone Elemental");
		await patchUnits(page, { [elemental.id]: { currentHp: 0 } });
		const free = {
			col: dodger.pos.col === 0 ? 0 : dodger.pos.col - 1,
			row: dodger.pos.row,
		};
		const blocked = start.units.some(
			(u) => u.pos.col === free.col && u.pos.row === free.row,
		);
		await moveHero(
			page,
			dodger.id,
			blocked ? { col: dodger.pos.col, row: dodger.pos.row + 2 } : free,
		);

		await endRound(page);
		const landed = await readBattle(page);
		const boulder = landed.units.find((u) => u.name === "Boulder");
		expect(boulder, "a boulder landed").toBeDefined();
		await expect(page.locator("[data-countdown='2']")).toBeVisible();

		// Crack it to half HP, and keep the Golem stunned so nothing else touches it.
		const stun = [{ type: "stun", amount: 1, duration: 9 }];
		await patchUnits(page, {
			[boulder?.id ?? ""]: { currentHp: 4 },
			[golem.id]: { statuses: stun },
		});

		await endRound(page);
		await expect(page.locator("[data-countdown='1']")).toBeVisible();
		await patchUnits(page, { [golem.id]: { statuses: stun } });

		await endRound(page);
		const woken = await readBattle(page);
		expect(woken.units.find((u) => u.name === "Boulder")).toBeUndefined();
		const rubble = woken.units.find((u) => u.name === "Rubble Elemental");
		expect(rubble?.pos).toEqual(boulder?.pos);
		expect(rubble?.maxHp).toBe(10);
		expect(rubble?.hp, "half a boulder wakes as half an elemental").toBe(5);
		expect(rubble?.id.startsWith("monster-"), "it counts toward victory").toBe(
			true,
		);
	});
});
