import { expect, test } from "@playwright/test";
import { GameBot } from "../support/bot";
import { newGame, readCampaign, readWorld, seed } from "../support/state";
import { BRANCHES } from "./branches";

/**
 * Every quest branch, played through the real UI from the quest's first step:
 * each win choice, each "Accept defeat" path, Try again / Retreat, class-only choices
 * and choices from earlier quests that change later fights.
 */
for (const branch of BRANCHES) {
	test(branch.name, async ({ page }, testInfo) => {
		const pageErrors: string[] = [];
		page.on("pageerror", (e) => pageErrors.push(e.message));

		await newGame(page);
		if (branch.setup) await seed(page, branch.setup);

		const bot = new GameBot(page, branch.quest, branch);
		try {
			await bot.playUntilComplete();
		} finally {
			await testInfo.attach("bot trace", {
				body: [...bot.trace, "", JSON.stringify(bot.encounters, null, 1)].join(
					"\n",
				),
				contentType: "text/plain",
			});
		}

		const camp = await readCampaign(page);
		const world = await readWorld(page);
		const e = branch.expect;

		expect
			.soft(bot.unusedChoices, "every scripted choice was offered")
			.toEqual([]);
		for (const q of [branch.quest, ...(e.completed ?? [])])
			expect.soft(camp.completedQuests, `quest ${q} complete`).toContain(q);
		for (const f of e.flags ?? [])
			expect.soft(camp.flags, `flag ${f}`).toContain(f);
		for (const f of e.noFlags ?? [])
			expect.soft(camp.flags, `no flag ${f}`).not.toContain(f);
		for (const [q, step] of Object.entries(e.step ?? {}))
			expect.soft(camp.activeQuests[q], `${q} step`).toBe(step);
		for (const r of e.runes ?? [])
			expect.soft(world.evolutionRunesInventory, `rune ${r}`).toContain(r);
		for (const r of e.noRunes ?? [])
			expect
				.soft(world.evolutionRunesInventory, `no rune ${r}`)
				.not.toContain(r);
		if (e.node) expect.soft(world.currentNodeId, "final map node").toBe(e.node);

		const fought = bot.encounters.map((x) => x.id);
		for (const id of e.notFought ?? [])
			expect.soft(fought, `skipped ${id}`).not.toContain(id);
		for (const [id, want] of Object.entries(e.monsters ?? {})) {
			const first = bot.encounters.find((x) => x.id === id);
			expect.soft(first, `fought ${id}`).toBeDefined();
			for (const [name, count] of Object.entries(want))
				expect
					.soft(
						first?.monsters.filter((m) => m === name).length,
						`${id}: ${name}`,
					)
					.toBe(count);
		}
		if (e.hpAtFirstBattle !== undefined)
			expect
				.soft(bot.firstBattleHp, "hero HP at the first battle")
				.toEqual(bot.firstBattleHp?.map(() => e.hpAtFirstBattle));

		// Soft-lock check: after the quest the game must open on a usable map or town.
		await page.goto("/");
		await expect(
			page.getByRole("button", { name: /^(MENU|RETURN TO MAP)$/i }).first(),
		).toBeVisible({ timeout: 15_000 });

		expect(pageErrors, "no uncaught page errors").toEqual([]);
	});
}
