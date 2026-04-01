// Import your custom 'test' instead of the default one
import * as fs from "fs";
import * as path from "path";
import { expect, test } from '../baseTest';

const DEATH_FUNNEL_SAVE = path.join(__dirname, "../world.fixtures.json");

test.beforeEach(async ({ page }) => {
  const saveData = fs.readFileSync(DEATH_FUNNEL_SAVE, "utf-8");
  await page.goto("http://localhost:3000/");
  await page.evaluate((data) => localStorage.setItem("alpha-world-state", data), saveData);
});

// Look at the arguments! getUnit and getTile are natively injected!
test("Barnaby executes the Death Funnel", async ({ page, getUnit, getTile }) => {
  await page.goto("http://localhost:3000/battle/encounter-mutated_barnaby");

  await getUnit("heroes/cleric").click();
  await getTile(1, 2).click();

  await getUnit("heroes/rogue").click();
  await getTile(1, 1).click();

  await expect(getUnit("heroes/rogue")).toContainText("☠");

	await page.pause();

  await page.getByRole("button", { name: "End turn" }).first().click();
  await page.getByRole("button", { name: "End turn" }).first().click();
  await page.getByRole("button", { name: "End turn" }).click();

  await expect(getUnit("heroes/rogue")).not.toBeVisible({ timeout: 10000 });
});