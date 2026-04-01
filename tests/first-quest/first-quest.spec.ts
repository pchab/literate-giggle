import { expect, test } from '../baseTest';

test('test', async ({ page, getUnit, getTile, getCard }) => {
  await page.goto('http://localhost:3000/start');
  await page.getByRole('button', { name: 'New Game' }).click();
  await page.getByRole('button', { name: '🏰' }).first().click();

  await page.getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Fine... I\'ll do it.' }).click();

  await expect(getUnit('heroes/hobo')).toHaveCount(3);
  for (const hobo of await getUnit('heroes/hobo').all()) {
    await expect(hobo).toHaveCurrentHp(10);
  }

  await getTile(0, 1).click();
  await getTile(0, 3).click();
  await getTile(1, 1).click();
  await getTile(0, 2).click();
  await getTile(1, 0).click();
  await getTile(1, 0).click();
  await getTile(1, 0).click();
  await getTile(1, 1).click();

  await page.getByRole('button', { name: 'End turn' }).first().click();
  await page.getByRole('button', { name: 'End turn' }).first().click();
  await page.getByRole('button', { name: 'End turn' }).click();

  await getTile(0, 3).click();
  await getTile(2, 3).click();
  await getTile(0, 2).click();
  await getTile(1, 2).click();
  await getTile(1, 1).click();
  await getTile(1, 1).click();
  await getTile(1, 1).click();
  await getTile(1, 1).click();

  await page.getByRole('button', { name: 'End turn' }).first().click();
  await page.getByRole('button', { name: 'End turn' }).first().click();

  await getTile(2, 3).click();
  await getTile(3, 4).click();
  await getCard('Shove').nth(2).click();

  expect(await getUnit('monsters/rat').nth(0)).toHaveCurrentHp(2);
  expect(await getUnit('monsters/rat').nth(1)).toHaveCurrentHp(2);
});