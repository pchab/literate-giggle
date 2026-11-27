import { expect, test } from "@playwright/test";
import { Q } from "./quests/branches";
import { GameBot } from "./support/bot";
import { newGame, readCampaign, readWorld } from "./support/state";

/** One continuous campaign from New Game, no seeding: choices must carry across quests. */
test("campaign: Rats → Ledger → Sump, earlier choices show up later", async ({
	page,
}) => {
	// Three quests back to back: well over the default per-test limit.
	test.setTimeout(8 * 60_000);
	await newGame(page);

	await test.step("Rats: lose to the King, chase it, win, leave the tunnel open", async () => {
		const bot = new GameBot(page, Q.rats, {
			choices: ["After it!", "Leave it."],
			battles: { "encounter-rat_boss": ["lose", "win"] },
		});
		const camp = await bot.playUntilComplete();
		expect(camp.flags).toContain("cellar_tunnel_open");
		expect(camp.activeQuests[Q.ledger]).toBe("quest-step-meet_barnaby");
	});

	await test.step("Ledger: fight Barnaby and jail him", async () => {
		const bot = new GameBot(page, Q.ledger, {
			choices: [
				"Consider it done",
				"This isn't medicine",
				"We read it",
				"Drag him out",
			],
		});
		const camp = await bot.playUntilComplete();
		expect(camp.flags).toContain("barnaby_jailed");
		expect(camp.activeQuests[Q.sump]).toBe("quest-step-sump_investigate");
	});

	await test.step("Sump: Barnaby's cell and the tunnel are offered; Riverbend", async () => {
		const bot = new GameBot(page, Q.sump, {
			choices: [
				"Barnaby's cell",
				"Rusty Boar's old tunnel",
				"Quietly",
				"Rush to Riverbend",
				"Begin: Riverbend",
				"Rush into the village",
				"Draw your weapons",
				"Stay and help",
			],
		});
		const camp = await bot.playUntilComplete();
		expect(bot.unusedChoices).toEqual([]);
		expect(camp.flags).toEqual(
			expect.arrayContaining(["barnaby_visited", "sump_snuck_past"]),
		);
		const fought = bot.encounters.map((x) => x.id);
		expect(fought).not.toContain("encounter-giant_toad");
		expect(fought).toContain("encounter-riverbend_village");
		expect((await readWorld(page)).currentNodeId).toBe("ironhold_city");
	});

	await test.step("The Rusty Boar's barman knows Barnaby is in the dungeon", async () => {
		await page.goto("/");
		await page.waitForTimeout(1500);
		const bot = new GameBot(page, "none");
		if (page.url().includes("/world")) {
			await page
				.locator(
					'div.group:has(> div > span:text-is("Ironhold City")) > button',
				)
				.first()
				.click();
			await page.waitForURL("**/towns/**");
		}
		await page
			.locator(
				'div.group:has(> div > span:text-is("The Rusty Boar Tavern")) > button',
			)
			.first()
			.click();
		await page.waitForURL("**/scenes/**");
		await bot.clickLabel("Any news?", "news");
		await expect(
			page.getByText(/Rotting in the Ironhold dungeon/),
		).toBeVisible();
	});

	expect((await readCampaign(page)).completedQuests).toEqual(
		expect.arrayContaining([Q.rats, Q.ledger, Q.sump]),
	);
});
