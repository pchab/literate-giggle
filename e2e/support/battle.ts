import type { Page } from "@playwright/test";

/** A battle unit as the tests read it from the store. */
export interface UnitView {
	id: string;
	name: string;
	hp: number;
	maxHp: number;
	pos: { col: number; row: number };
	patternStep?: number;
	phaseIndex?: number;
}

export interface IntentView {
	unitId: string;
	cardId: string;
	lockedZone?: { col: number; row: number }[];
}

/** Opens the dev fight room and starts an encounter with the room's default party. */
export async function startFightRoomBattle(page: Page, encounterName: string) {
	await page.goto("/dev/fights");
	await page.getByRole("button", { name: `Fight ${encounterName}` }).click();
	await page.waitForURL("**/battle/**");
	await waitForBattle(page);
}

export async function waitForBattle(page: Page) {
	await page.waitForFunction(
		() => {
			const store = (window as unknown as BattleWindow).__battleStore;
			return !!store && store.getState().units.length > 0;
		},
		undefined,
		{ timeout: 30_000 },
	);
	await page.waitForTimeout(1500);
}

export async function readBattle(page: Page) {
	return page.evaluate(() => {
		const s = (window as unknown as BattleWindow).__battleStore.getState();
		return {
			units: s.units.map((u) => ({
				id: u.id,
				name: u.name,
				hp: u.currentHp,
				maxHp: u.maxHp,
				pos: u.gridPosition,
				patternStep: u.patternStep,
				phaseIndex: u.phaseIndex,
			})),
			intents: Object.values(s.aiIntents).map((i) => ({
				unitId: i.unitId,
				cardId: i.cardId,
				lockedZone: i.lockedZone,
			})),
			barks: s.barks.map((b) => b.text),
		};
	});
}

export const heroesOf = (units: UnitView[]) =>
	units.filter((u) => u.id.startsWith("hero-"));
export const unitNamed = (units: UnitView[], name: string) =>
	units.find((u) => u.name === name) as UnitView;

/** Ends every hero's turn and waits for the enemy turn to finish. */
export async function endRound(page: Page) {
	const { units } = await readBattle(page);
	for (const hero of heroesOf(units)) {
		await page.evaluate(
			(id) =>
				(window as unknown as BattleWindow).__battleStore
					.getState()
					.endTurn(id),
			hero.id,
		);
	}
	await page.waitForFunction(
		() => {
			const s = (window as unknown as BattleWindow).__battleStore.getState();
			return Object.keys(s.usedCardsThisTurn).length === 0;
		},
		undefined,
		{ timeout: 30_000 },
	);
	await page.waitForTimeout(1000);
}

export async function moveHero(
	page: Page,
	heroId: string,
	to: { col: number; row: number },
) {
	await page.evaluate(
		([id, cell]) => {
			const s = (window as unknown as BattleWindow).__battleStore.getState();
			s.setActiveMoveHeroId(id);
			s.moveHero(cell);
		},
		[heroId, to] as const,
	);
	await page.waitForTimeout(1200);
}

/** Directly edits units (positions, HP...) to set up a scenario. */
export async function patchUnits(
	page: Page,
	/** Unit id -> fields to overwrite (gridPosition, currentHp, statuses...). */
	patches: Record<string, Record<string, unknown>>,
) {
	await page.evaluate((p) => {
		(window as unknown as BattleWindow).__battleStore.setState((s) => ({
			units: s.units.map((u) => (p[u.id] ? { ...u, ...p[u.id] } : u)),
		}));
	}, patches);
	await page.waitForTimeout(300);
}

/** Plays a card from a hero's hand (by card name) on a target cell. */
export async function playCard(
	page: Page,
	heroId: string,
	cardName: string,
	target: { col: number; row: number },
) {
	await page.evaluate(
		async ([id, name, cell]) => {
			const store = (window as unknown as BattleWindow).__battleStore;
			const hero = store.getState().units.find((u) => u.id === id);
			const card = hero?.hand?.find((c) => c?.name === name);
			if (!card) throw new Error(`${name} not in hand`);
			await store.getState().selectCard(id, card);
			store
				.getState()
				.resolveCard({ gridPosition: cell }, { unitId: id, card });
		},
		[heroId, cardName, target] as const,
	);
	await page.waitForTimeout(2500);
}

interface BattleWindow {
	__battleStore: {
		getState(): BattleStateView;
		setState(
			partial:
				| Partial<BattleStateView>
				| ((s: BattleStateView) => Partial<BattleStateView>),
		): void;
	};
}

interface BattleStateView {
	units: {
		id: string;
		name: string;
		currentHp: number;
		maxHp: number;
		gridPosition: { col: number; row: number };
		patternStep?: number;
		phaseIndex?: number;
		hand?: ({ name: string } | null)[];
	}[];
	aiIntents: Record<string, IntentView>;
	barks: { text: string }[];
	usedCardsThisTurn: Record<string, unknown>;
	endTurn(id: string): void;
	setActiveMoveHeroId(id: string): void;
	moveHero(cell: { col: number; row: number }): void;
	selectCard(id: string, card: unknown): Promise<void>;
	resolveCard(anchor: unknown, ctx: unknown): void;
}
