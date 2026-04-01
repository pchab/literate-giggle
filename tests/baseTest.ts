import { test as base, expect as baseExpect, type Locator } from '@playwright/test';

// ==========================================
// 1. TYPESCRIPT DECLARATIONS FOR EXPECT
// ==========================================
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeInTile(expected: { col: number; row: number }): Promise<R>;
      toHaveCurrentHp(expectedHp: number | string): Promise<R>;
    }
  }
}

// ==========================================
// 2. EXTEND EXPECT WITH CUSTOM MATCHERS
// ==========================================
export const expect = baseExpect.extend({

  async toBeInTile(locator: Locator, expected: { col: number; row: number }) {
    // Playwright matchers need to gracefully handle resolving the DOM state
    const actualCol = await locator.getAttribute('data-grid-col');
    const actualRow = await locator.getAttribute('data-grid-row');

    const pass = actualCol === String(expected.col) && actualRow === String(expected.row);

    const message = pass
      ? () => `Expected unit NOT to be in tile ${expected.col},${expected.row}, but it was.`
      : () => `Expected unit to be in tile ${expected.col},${expected.row}, but found it at ${actualCol},${actualRow}.`;

    return { message, pass };
  },

  async toHaveCurrentHp(locator: Locator, expectedHp: number | string) {
    const fullText = await locator.innerText();
    const hpMatch = fullText.match(/(\d+)\s*\/\s*\d+/);

    if (!hpMatch) {
      return {
        pass: false,
        message: () => `Could not find any HP pattern (like X/Y) inside the unit text. Text found: "${fullText}"`
      };
    }

    const currentHp = hpMatch[1];
    const pass = currentHp === String(expectedHp);

    const message = pass
      ? () => `Expected HP NOT to be ${expectedHp}, but it was.`
      : () => `Expected HP to be ${expectedHp}, but found ${currentHp} (from text: "${hpMatch[0]}").`;

    return { message, pass };
  }
});

// ==========================================
// 3. YOUR EXISTING FIXTURES
// ==========================================
type BattleFixtures = {
  getUnit: (unitName: string) => Locator;
  getTile: (col: number, row: number) => Locator;
  getCard: (cardName: string) => Locator;
  playCard: (cardName: string) => Promise<void>;
};

export const test = base.extend<BattleFixtures>({
  getUnit: async ({ page }, use) => {
    await use((unitName: string) => page.getByRole("button", { name: unitName }));
  },
  getTile: async ({ page }, use) => {
    await use((col: number, row: number) => page.getByRole("button", { name: `${col},${row}` }));
  },
  getCard: async ({ page }, use) => {
    await use((cardName: string) => page.getByRole("button", { name: cardName }));
  },
  playCard: async ({ page }, use) => {
    await use(async (cardName: string) => {
      await page.getByRole("button", { name: cardName }).click();
    });
  }
});