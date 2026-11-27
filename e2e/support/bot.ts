import type { Page } from "@playwright/test";
import { TOWN_DB } from "@/modules/towns/data/towns.data";
import type { TownData } from "@/modules/towns/domain/towns.type";
import { dynamicMap, questTargets, shortestPath } from "./map";
import { type CampaignSave, readCampaign, readWorld } from "./state";

/** How a battle ends. `savedVillagers` wins the Riverbend escort with that many villagers out. */
export type BattleOutcome = "win" | "lose" | { savedVillagers: number };

export interface BotScript {
	/** Scene choices to pick, in order (case-insensitive substrings of the button label). */
	choices?: string[];
	/** Outcomes per encounter id, consumed in order. Unlisted battles are won. */
	battles?: Record<string, BattleOutcome[]>;
	/** Buttons to press on the defeat screen, in order. Default: "Accept defeat". */
	defeat?: string[];
}

export class BotError extends Error {}

/** Location ids/nodes that are done once a flag is set (multi-target quest steps). */
const CLEARED_BY: Record<string, string> = {
	"town-location-siege_gates": "gates_cleared",
	"town-location-siege_tavern": "tavern_cleared",
	northern_treant_army: "north_cleared",
	western_weavers_army: "west_cleared",
	southern_beastmaster_army: "south_cleared",
};

/** Buttons that are UI chrome, not scene choices. */
const CHROME = new Set(["MENU", "RETURN TO MAP", "CLOSE", "X", ""]);

const ROUTE_FOR_PHASE: Record<string, string> = {
	MAP: "/world",
	TOWN: "/towns/",
	SCENE: "/scenes/",
	BATTLE: "/battle/",
	REWARD: "/reward",
	DEFEAT: "/defeat",
};

/**
 * Plays one quest through the real UI: walks the map to the active step's target,
 * enters towns and locations, picks scripted scene choices, ends battles through the
 * dev-only battle store hook, and clicks through the reward and defeat screens.
 *
 * Scene choices must be scripted: a choice screen with several options and no matching
 * scripted choice fails, so every decision in a test is explicit.
 */
export class GameBot {
	readonly trace: string[] = [];
	readonly encounters: { id: string; monsters: string[] }[] = [];
	firstBattleHp: number[] | null = null;
	private choices: string[];
	private battles: Record<string, BattleOutcome[]>;
	private defeat: string[];

	constructor(
		private readonly page: Page,
		private readonly questId: string,
		script: BotScript = {},
	) {
		this.choices = [...(script.choices ?? [])];
		this.battles = Object.fromEntries(
			Object.entries(script.battles ?? {}).map(([k, v]) => [k, [...v]]),
		);
		this.defeat = [...(script.defeat ?? [])];
	}

	get unusedChoices() {
		return [...this.choices];
	}

	/** Plays until the quest is complete and the game is back on the map or in a town. */
	async playUntilComplete(maxSteps = 150) {
		return this.playUntil(
			(camp) => camp.completedQuests.includes(this.questId) && this.isIdle(),
			maxSteps,
		);
	}

	async playUntil(done: (camp: CampaignSave) => boolean, maxSteps = 150) {
		let last = "";
		let same = 0;
		for (let i = 0; i < maxSteps; i++) {
			const camp = await readCampaign(this.page);
			if (done(camp)) return camp;
			const url = this.page.url();
			const key = `${url}|${this.trace.length}`;
			same = key === last ? same + 1 : 0;
			last = key;
			if (same > 8) throw new BotError(`stuck at ${url}`);

			if (url.includes("/world")) await this.onWorld(camp);
			else if (url.includes("/towns/")) await this.onTown(camp);
			else if (url.includes("/scenes/")) await this.onScene();
			else if (url.includes("/battle/")) await this.onBattle();
			else if (url.includes("/reward"))
				await this.clickLabel("CLAIM & RETURN", "claim rewards");
			else if (url.includes("/defeat")) {
				const label = this.defeat.shift() ?? "Accept defeat";
				await this.clickLabel(label, `defeat: ${label}`);
			} else await this.page.waitForTimeout(500);
		}
		throw new BotError(
			`not finished after ${maxSteps} steps, at ${this.page.url()}`,
		);
	}

	isIdle() {
		const url = this.page.url();
		return url.includes("/world") || url.includes("/towns/");
	}

	// ---------------------------------------------------------------- map
	private async onWorld(camp: CampaignSave) {
		const world = await readWorld(this.page);
		const here = world.currentNodeId;
		const map = dynamicMap(camp, here);
		const stepId = camp.activeQuests[this.questId];
		if (!stepId)
			throw new BotError(`${this.questId} is not active (on the map)`);

		const target = questTargets(this.questId, stepId).find(
			(t) => map[t.mapNodeId] && !this.isCleared(t, camp),
		);
		if (!target) throw new BotError(`no reachable target for ${stepId}`);

		if (target.mapNodeId === here) {
			if (map[here].type === "TOWN") {
				return this.clickNode(map[here].name, `enter ${here}`);
			}
			// Standing on a non-town target: step off and come back.
			const off = map[here].connectedNodeIds.find((n) => map[n]);
			if (!off) throw new BotError(`stuck on ${here}`);
			return this.clickNode(map[off].name, `step off to ${off}`);
		}
		const path = shortestPath(map, here, target.mapNodeId);
		if (!path) throw new BotError(`no path ${here} -> ${target.mapNodeId}`);
		await this.clickNode(map[path[1]].name, `travel ${here} -> ${path[1]}`);
	}

	private isCleared(
		t: { mapNodeId: string; locationId?: string },
		camp: CampaignSave,
	) {
		const flag = CLEARED_BY[t.locationId ?? t.mapNodeId];
		return !!flag && camp.flags.includes(flag);
	}

	private async clickNode(name: string, why: string) {
		this.trace.push(why);
		const before = await this.worldRaw();
		await this.page
			.locator(`div.group:has(> div > span:text-is("${name}")) > button`)
			.first()
			.click();
		await this.settle(before);
	}

	// ---------------------------------------------------------------- towns
	private async onTown(camp: CampaignSave) {
		const townId = this.page.url().split("/towns/")[1].split(/[?#]/)[0];
		const town = TOWN_DB[townId as TownData["id"]];
		const names = new Map(
			(town?.locations ?? []).map((l) => [l.id as string, l.name]),
		);
		const stepId = camp.activeQuests[this.questId];
		const targets = stepId
			? questTargets(this.questId, stepId).filter(
					(t) =>
						t.locationId && names.has(t.locationId) && !this.isCleared(t, camp),
				)
			: [];
		for (const t of targets) {
			const name = names.get(t.locationId as string) as string;
			const pin = this.page.locator(
				`div.group:has(> div > span:text-is("${name}")) > button`,
			);
			if (await pin.count()) {
				this.trace.push(`town ${townId}: ${name}`);
				const before = await this.worldRaw();
				await pin.first().click();
				await this.settle(before);
				return;
			}
		}
		this.trace.push(`town ${townId}: return to map`);
		const before = await this.worldRaw();
		await this.page.getByText("RETURN TO MAP").first().click();
		await this.settle(before);
	}

	// ---------------------------------------------------------------- scenes
	private async onScene() {
		await this.page.waitForTimeout(400);
		if (!this.page.url().includes("/scenes/")) return;
		const options = (await this.stableButtons()).filter(
			([, label]) => !CHROME.has(label.toUpperCase()),
		);
		if (!options.length) {
			await this.page.waitForTimeout(800);
			return;
		}
		const wanted = this.choices[0]?.toUpperCase();
		const hit = wanted
			? options.find(([, label]) => label.toUpperCase().includes(wanted))
			: undefined;
		if (hit) {
			this.choices.shift();
			return this.clickIndex(hit[0], `choose: ${hit[1]}`);
		}
		if (options.length === 1) {
			return this.clickIndex(options[0][0], `only: ${options[0][1]}`);
		}
		throw new BotError(
			`unscripted choice at ${this.page.url()}: ${options.map(([, l]) => l).join(" | ")}` +
				` (next scripted: ${this.choices[0] ?? "none"})`,
		);
	}

	// ---------------------------------------------------------------- battles
	private async onBattle() {
		const id = this.page.url().split("/battle/")[1].split("?")[0];
		await this.page.waitForFunction(
			() => {
				const store = (window as unknown as BattleWindow).__battleStore;
				return !!store && store.getState().units.length > 0;
			},
			undefined,
			{ timeout: 30_000 },
		);
		await this.page.waitForTimeout(500);
		const { monsters, heroHp } = await this.page.evaluate(() => {
			const units = (window as unknown as BattleWindow).__battleStore.getState()
				.units;
			return {
				monsters: units
					.filter((u) => u.id.startsWith("monster-"))
					.map((u) => u.name)
					.sort(),
				heroHp: units
					.filter((u) => u.id.startsWith("hero-"))
					.map((u) => u.currentHp),
			};
		});
		this.encounters.push({ id, monsters });
		this.firstBattleHp ??= heroHp;

		const outcome = this.battles[id]?.shift() ?? "win";
		this.trace.push(`battle ${id} -> ${JSON.stringify(outcome)}`);
		if (outcome === "win") {
			await this.page.evaluate(() =>
				(window as unknown as BattleWindow).__battleStore.setState((s) => ({
					units: s.units.map((u) =>
						u.id.startsWith("monster-") ? { ...u, currentHp: 0 } : u,
					),
					battleStatus: "VICTORY",
				})),
			);
		} else if (outcome === "lose") {
			await this.page.evaluate(() =>
				(window as unknown as BattleWindow).__battleStore.setState((s) => ({
					units: s.units.map((u) =>
						u.id.startsWith("hero-") ? { ...u, currentHp: 0 } : u,
					),
					battleStatus: "DEFEAT",
				})),
			);
		} else {
			// Escort win: villagers leave the field (saved ones escaped), then the fight ends.
			await this.page.evaluate((saved) => {
				const store = (window as unknown as BattleWindow).__battleStore;
				store.setState((s) => ({
					units: s.units.filter((u) => u.name !== "Villager"),
					objectiveProgress: { ...s.objectiveProgress, savedVillagers: saved },
				}));
			}, outcome.savedVillagers);
			await this.page.waitForTimeout(300);
			await this.page.evaluate(() =>
				(window as unknown as BattleWindow).__battleStore.setState({
					battleStatus: "VICTORY",
				}),
			);
		}
		await this.page.waitForURL((u) => !u.pathname.startsWith("/battle/"), {
			timeout: 30_000,
		});
		await this.page.waitForTimeout(800);
	}

	// ---------------------------------------------------------------- clicking
	/** [index in the page's button list, label] for visible, enabled buttons. */
	async buttons(): Promise<[number, string][]> {
		return this.page.evaluate(() =>
			[...document.querySelectorAll("button")]
				.map((el, i) => [i, el] as const)
				.filter(([, el]) => el.offsetParent !== null && !el.disabled)
				.map(([i, el]) => [
					i,
					(el.innerText || "").replace(/\s+/g, " ").trim(),
				]),
		);
	}

	/** Waits until the button list stops changing (scene steps animate in and out). */
	private async stableButtons() {
		let prev = "";
		let cur: [number, string][] = [];
		for (let i = 0; i < 20; i++) {
			cur = await this.buttons();
			const key = JSON.stringify(cur);
			if (key === prev) return cur;
			prev = key;
			await this.page.waitForTimeout(350);
		}
		return cur;
	}

	async clickLabel(label: string, why: string) {
		await this.page.waitForTimeout(400);
		const hit = (await this.stableButtons()).find(([, l]) =>
			l.toUpperCase().includes(label.toUpperCase()),
		);
		if (!hit) {
			const all = (await this.buttons()).map(([, l]) => l).join(" | ");
			throw new BotError(`no '${label}' button at ${this.page.url()}: ${all}`);
		}
		await this.clickIndex(hit[0], why);
	}

	private async clickIndex(index: number, why: string) {
		this.trace.push(why);
		const before = await this.snapshot();
		await this.page.locator("button").nth(index).click();
		for (let i = 0; i < 40; i++) {
			await this.page.waitForTimeout(250);
			if ((await this.snapshot().catch(() => before)) !== before) break;
		}
		await this.page.waitForTimeout(500);
	}

	private async snapshot() {
		return `${this.page.url()}|${await this.page.evaluate(() => document.body.innerText.slice(0, 400))}`;
	}

	private async worldRaw() {
		return this.page.evaluate(() => localStorage.getItem("alpha-world-state"));
	}

	/** After a map/town click: wait for the save to change and the URL to match the phase. */
	private async settle(before: string | null) {
		for (let i = 0; i < 40; i++) {
			await this.page.waitForTimeout(250);
			if ((await this.worldRaw().catch(() => before)) !== before) break;
		}
		for (let i = 0; i < 40; i++) {
			const phase = await readWorld(this.page)
				.then((w) => w.phase)
				.catch(() => "");
			if (phase && this.page.url().includes(ROUTE_FOR_PHASE[phase] ?? ""))
				break;
			await this.page.waitForTimeout(250);
		}
		await this.page.waitForTimeout(600);
	}
}

/** The dev-only battle store handle (see battle.store.ts). */
interface BattleWindow {
	__battleStore: {
		getState(): BattleSnapshot;
		setState(
			partial:
				| Partial<BattleSnapshot>
				| ((s: BattleSnapshot) => Partial<BattleSnapshot>),
		): void;
	};
}

interface BattleSnapshot {
	units: { id: string; name: string; currentHp: number }[];
	objectiveProgress: Record<string, number>;
	battleStatus: string;
}
