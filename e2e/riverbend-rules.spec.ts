import { expect, test } from "@playwright/test";
import type { BattleState } from "@/modules/battle/store/battle.store";
import { ENCOUNTER_DB } from "@/modules/campaign/data/encounters.data";
import type { Encounter } from "@/modules/campaign/domain/encounters.type";

/**
 * The Riverbend escort ends only when every villager has escaped or fallen, so saving
 * all four is reachable. No browser needed: these call the encounter's rules directly.
 */
const riverbend =
	ENCOUNTER_DB["encounter-riverbend_village" as Encounter["id"]];

const hero = { id: "hero-1", name: "Hero", currentHp: 10, heroClass: "HOBO" };
const villager = (hp = 5) => ({
	id: "summon-v",
	name: "Villager",
	currentHp: hp,
});
const state = (units: object[], savedVillagers: number) =>
	({ units, objectiveProgress: { savedVillagers } }) as unknown as BattleState;

const CASES: [
	string,
	BattleState,
	{ win: boolean; loss: boolean; allSaved: boolean },
][] = [
	[
		"2 saved, 2 still on the field",
		state([hero, villager(), villager()], 2),
		{ win: false, loss: false, allSaved: false },
	],
	[
		"2 saved, 2 fell",
		state([hero, villager(0), villager(0)], 2),
		{ win: true, loss: false, allSaved: false },
	],
	[
		"3 saved, 1 still on the field",
		state([hero, villager()], 3),
		{ win: false, loss: false, allSaved: false },
	],
	["all 4 saved", state([hero], 4), { win: true, loss: false, allSaved: true }],
	[
		"1 saved, 1 walking, 2 fell",
		state([hero, villager(), villager(0), villager(0)], 1),
		{ win: false, loss: false, allSaved: false },
	],
	[
		"1 saved, 3 fell",
		state([hero, villager(0), villager(0), villager(0)], 1),
		{ win: false, loss: true, allSaved: false },
	],
	[
		"heroes wiped",
		state([villager(), villager()], 0),
		{ win: false, loss: true, allSaved: false },
	],
];

test.describe("Riverbend escort rules", () => {
	for (const [name, s, want] of CASES) {
		test(name, () => {
			expect(riverbend.checkWin?.(s)).toBe(want.win);
			expect(riverbend.checkLoss?.(s)).toBe(want.loss);
			expect(
				riverbend.outcomeFlags?.(s)?.includes("riverbend_all_saved") ?? false,
			).toBe(want.allSaved);
		});
	}

	test("objective text shows the total and the minimum", () => {
		expect(riverbend.objectiveText?.({ savedVillagers: 3 })).toBe(
			"Villagers saved: 3/4 (need 2)",
		);
	});
});
