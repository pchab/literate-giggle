import { expect, test } from "@playwright/test";
import { GameBot } from "./support/bot";
import { newGame, readWorld, seed } from "./support/state";

const TAVERNS = [
	{ node: "cromee_town", town: "Cromee Town", tavern: "The Rusty Nail Tavern" },
	{
		node: "connury_town",
		town: "Connury Town",
		tavern: "Ye Olde Pants Tavern",
	},
	{
		node: "ironhold_city",
		town: "Ironhold City",
		tavern: "The Rusty Boar Tavern",
	},
];

/** [flags, text the barman should say], in the order tavern.data.ts checks them. */
const RUMOURS: [string[], RegExp][] = [
	[["ironhold_fallen"], /Ironhold's gone/],
	[["banished_from_ironhold"], /price on some sellswords/],
	[["riverbend_fallen"], /lanterns went dark/],
	[["riverbend_all_saved"], /every last soul/],
	[["black_fangs_broken"], /lost a whole barge/],
	[["barnaby_free"], /mad alchemist selling/],
	[["barnaby_escaped"], /nailed to every door/],
	[["barnaby_jailed"], /Rotting in the Ironhold dungeon/],
	[["rat_king_escaped"], /crown of bones/],
	[["kept_necronomicon"], /barred his tower/],
	[["necromancer_free"], /Dead men walking/],
	[["passage_collapsed"], /blew up the old mountain road/],
	[["dwarves_allied"], /fixed their golem/],
	[["vane_debt"], /never forgets a debt/],
	[[], /Quiet times/],
	// Several apply: the first in the list wins.
	[["vane_debt", "riverbend_fallen", "barnaby_jailed"], /lanterns went dark/],
];

test.describe("tavern rumours", () => {
	RUMOURS.forEach(([flags, text], i) => {
		// Ironhold has no tavern once it has fallen.
		const place = flags.includes("ironhold_fallen")
			? TAVERNS[0]
			: TAVERNS[i % 3];
		test(`${place.tavern}: ${flags.join(" + ") || "no flags"}`, async ({
			page,
		}) => {
			await newGame(page);
			await seed(page, { active: {}, flags, node: place.node, hp: 5 });
			const bot = new GameBot(page, "none");

			await page
				.locator(
					`div.group:has(> div > span:text-is("${place.town}")) > button`,
				)
				.first()
				.click();
			await page.waitForURL("**/towns/**");
			await page
				.locator(
					`div.group:has(> div > span:text-is("${place.tavern}")) > button`,
				)
				.first()
				.click();
			await page.waitForURL("**/scenes/**");

			await bot.clickLabel("Any news?", "news");
			await expect(page.getByText(text)).toBeVisible();

			await bot.clickLabel("An ale, then", "ale");
			await expect(page).toHaveURL(/\/towns\//);
			expect((await readWorld(page)).roster.map((h) => h.currentHp)).toEqual([
				7, 7, 7,
			]);
		});
	});
});
