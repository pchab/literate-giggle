import { expect, test } from "@playwright/test";
import { readBattle, startFightRoomBattle } from "./support/battle";
import { newGame, readCampaign, seed } from "./support/state";

test.describe("save slots", () => {
	test("save in the menu, start over, load from the title screen", async ({
		page,
	}) => {
		await newGame(page);
		await seed(page, { flags: ["slot_marker"] });

		await page.getByRole("button", { name: /^menu$/i }).click();
		await page.getByRole("button", { name: /^system$/i }).click();
		const slots = page.getByRole("list", { name: "Save slots" });
		await slots
			.getByRole("button", { name: /save here/i })
			.first()
			.click();
		await expect(slots.getByRole("listitem").first()).toContainText(
			"Ironhold City",
		);
		await expect(slots.getByRole("listitem").first()).toContainText("Hobo 1");

		await page.goto("/start");
		await expect(
			page.getByRole("button", { name: /^continue$/i }),
		).toBeVisible();
		await newGame(page);
		expect((await readCampaign(page)).flags).toEqual([]);

		await page.goto("/start");
		await page.getByRole("button", { name: /^load game$/i }).click();
		await page.getByRole("button", { name: "Load slot 1" }).click();
		await page.waitForURL("**/world");
		expect((await readCampaign(page)).flags).toEqual(["slot_marker"]);
	});
});

test.describe("fight room", () => {
	test("a practice fight uses the preset party and leaves the game untouched", async ({
		page,
	}) => {
		await newGame(page);
		const before = await page.evaluate(() =>
			localStorage.getItem("alpha-world-state"),
		);

		await startFightRoomBattle(page, "The Golem Overseer");
		const { units } = await readBattle(page);
		expect(
			units.filter((u) => u.id.startsWith("hero-")).map((u) => u.maxHp),
		).toEqual([19, 18, 19]);

		await page.evaluate(() =>
			(
				window as unknown as {
					__battleStore: { setState(p: object): void };
				}
			).__battleStore.setState({ battleStatus: "DEFEAT" }),
		);
		await page.waitForURL("**/dev/fights");
		await expect(page.getByRole("status")).toContainText(/defeat/i);
		await expect(page.getByRole("status")).toContainText("The Golem Overseer");

		const after = await page.evaluate(() =>
			localStorage.getItem("alpha-world-state"),
		);
		expect(JSON.parse(after ?? "{}").state).toEqual(
			JSON.parse(before ?? "{}").state,
		);
	});
});
