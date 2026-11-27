import type { Page } from "@playwright/test";

/** What the campaign store persists to localStorage ("alpha-campaign-state"). */
export interface CampaignSave {
	activeQuests: Record<string, string>;
	completedQuests: string[];
	flags: string[];
	activeSceneId: string | null;
}

/** The parts of the world store save ("alpha-world-state") the tests read or seed. */
export interface WorldSave {
	phase: string;
	currentNodeId: string;
	roster: { name: string; heroClass: string; currentHp: number }[];
	evolutionRunesInventory: string[];
}

export const RATS_QUEST = "quest-rat_in_the_cellar";

export async function readCampaign(page: Page): Promise<CampaignSave> {
	return page.evaluate(
		() =>
			JSON.parse(localStorage.getItem("alpha-campaign-state") ?? "{}").state,
	);
}

export async function readWorld(page: Page): Promise<WorldSave> {
	return page.evaluate(
		() => JSON.parse(localStorage.getItem("alpha-world-state") ?? "{}").state,
	);
}

/** Starts a New Game from the title screen and waits for the world map. */
export async function newGame(page: Page) {
	await page.goto("/start");
	await page.getByText("New Game").click();
	await page.waitForURL("**/world", { timeout: 30_000 });
	await page.waitForTimeout(500);
}

export interface Setup {
	/** Quests to make active, keyed by quest id (replaces the New Game quests). */
	active?: Record<string, string>;
	completed?: string[];
	flags?: string[];
	/** Hero classes, in roster order (only the first N heroes change). */
	classes?: string[];
	/** Current HP for every hero. */
	hp?: number;
	node?: string;
}

/**
 * Puts the save in the state a quest would start from (as if unlocked by a level-up),
 * then reloads the game on the map. Without `active`, the New Game state is kept.
 */
export async function seed(page: Page, setup: Setup) {
	await page.evaluate(
		([s, rats]) => {
			const c = JSON.parse(
				localStorage.getItem("alpha-campaign-state") ?? "{}",
			);
			if (s.active) {
				c.state.activeQuests = s.active;
				c.state.completedQuests = [...new Set([rats, ...(s.completed ?? [])])];
			}
			c.state.flags = s.flags ?? [];
			localStorage.setItem("alpha-campaign-state", JSON.stringify(c));
			const w = JSON.parse(localStorage.getItem("alpha-world-state") ?? "{}");
			(s.classes ?? []).forEach((cls, i) => {
				w.state.roster[i].heroClass = cls;
			});
			if (s.hp) for (const h of w.state.roster) h.currentHp = s.hp;
			w.state.phase = "MAP";
			if (s.node) w.state.currentNodeId = s.node;
			localStorage.setItem("alpha-world-state", JSON.stringify(w));
		},
		[setup, RATS_QUEST] as const,
	);
	await page.goto("/");
	await page.waitForURL("**/world", { timeout: 30_000 });
	await page.waitForTimeout(500);
}
