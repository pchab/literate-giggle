import { expect, test } from "@playwright/test";
import { newGame } from "./support/state";

/**
 * Scenes that branch on entry (step `onEnter`) must never show, even for a frame,
 * the step they branch away from: it would flash and its buttons would be clickable.
 */
const CASES = [
	{
		scene: "scene-assault_tavern_ambush",
		flags: ["cellar_sealed", "aligned_with_forest"],
		wrong: /assault the taproom/i,
		right: /nothing personal/i,
	},
	{
		scene: "scene-riverbend_victory",
		flags: ["riverbend_all_saved"],
		wrong: /find the ones who poisoned/i,
		right: /accept the charm/i,
	},
	{
		scene: "scene-ironhold_sump_intro",
		flags: ["mutagen_spreading"],
		wrong: /remembering the mutated rat/i,
		right: /drowning in fresh mutagen/i,
	},
	{
		scene: "scene-mage_tower_finale",
		flags: ["necromancer_free"],
		wrong: /hand over the tome/i,
		right: /go back down/i,
	},
];

for (const c of CASES) {
	test(`${c.scene} opens directly on its branched step`, async ({ page }) => {
		await newGame(page);
		await page.evaluate((flags) => {
			const camp = JSON.parse(
				localStorage.getItem("alpha-campaign-state") ?? "{}",
			);
			camp.state.flags = flags;
			localStorage.setItem("alpha-campaign-state", JSON.stringify(camp));
			const world = JSON.parse(
				localStorage.getItem("alpha-world-state") ?? "{}",
			);
			world.state.phase = "SCENE";
			localStorage.setItem("alpha-world-state", JSON.stringify(world));
		}, c.flags);

		await page.goto(`/scenes/${c.scene}`, { waitUntil: "commit" });
		let sawWrong = false;
		let sawRight = false;
		for (let i = 0; i < 60; i++) {
			const text = await page
				.evaluate(() => document.body?.innerText ?? "")
				.catch(() => "");
			sawWrong ||= c.wrong.test(text);
			sawRight ||= c.right.test(text);
			await page.waitForTimeout(50);
		}
		expect(sawWrong, "the un-branched step was never visible").toBe(false);
		expect(sawRight, "the branched step is shown").toBe(true);
	});
}
