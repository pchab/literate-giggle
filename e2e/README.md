# End-to-end tests

These tests play the campaign through the real UI: the world map, towns, scenes, battles, and the reward and defeat screens.

```bash
npx playwright install chromium   # once
npm run test:e2e                  # everything (88 tests, about 30 min with 3 workers)
npm run test:e2e -- -g "sump"     # only tests whose name matches
npm run test:e2e:ui               # Playwright UI: pick tests, watch them play
```

Playwright starts its own dev server on port 3100 with `NEXT_PUBLIC_E2E=1`. That flag exposes the battle store as `window.__battleStore`, which lets a test end a fight as a win or a loss. Normal `npm run dev` and production builds don't expose it. If a server is already running on 3100, Playwright reuses it (except on CI). After a run, `npx playwright show-report` opens the HTML report; failed tests include a trace and a screenshot.

## What's covered

| File | What it checks |
|---|---|
| `quests/quests.spec.ts` + `quests/branches.ts` | Every quest branch (53): each win choice, each *Accept defeat* path, Try again and Retreat, class-only choices, and choices from earlier quests that change later fights. Each one checks flags, quest steps, runes, the final map node and enemy rosters. Afterwards it checks that the game opens on a usable map or town, and that the page threw no errors. |
| `campaign.spec.ts` | One continuous campaign from New Game, with no seeding: Rats → Ledger → Sump. Earlier choices (open tunnel, jailed Barnaby) must show up later on their own. |
| `tavern.spec.ts` | All 15 tavern rumours, which one wins when several apply, and the ale heal, across the three taverns. |
| `scene-entry.spec.ts` | Scenes that branch on entry never show the step they branch away from, not even for a frame. |
| `riverbend-rules.spec.ts` | The Riverbend escort's win, loss and "all saved" rules (no browser). |
| `bosses/golem.spec.ts` | The Golem Overseer's script: opening bark, locked telegraphs, falling rocks and boulders, boulder collisions, the 50% phase change. Fought from the dev fight room. |
| `tools.spec.ts` | Save slots (save, start over, load from the title screen) and the fight room (preset party, the real game left untouched). |

## How a branch test works

`support/bot.ts` (`GameBot`) plays one quest the way a player would:

- **Map:** it finds the active quest step's target and walks the shortest path to it on the live map (`support/map.ts` mirrors `useDynamicMap`). It fights any battle nodes on the way.
- **Towns:** it opens the quest's location, or returns to the map.
- **Scenes:** it picks the next scripted choice. A screen with a single button is clicked automatically. A screen with several choices and no matching scripted choice fails the test, so every decision is written down in the branch.
- **Battles:** each battle is won unless the branch says otherwise (`"lose"`, or `{ savedVillagers: n }` for the Riverbend escort).
- **Defeat screen:** it presses "Accept defeat" unless the branch lists another button.

A branch either starts from New Game (Rats) or seeds the save the way a level-up unlock would (`support/state.ts` `seed`): the active quest, earlier flags, hero classes and HP.

To add a branch, add an entry to `BRANCHES` in `quests/branches.ts`. Choices are case-insensitive substrings of the button labels.

## Boss tests

`support/battle.ts` starts a fight from the dev fight room (`/dev/fights`) and reads or edits the battle store directly: unit positions and HP, intents and their locked telegraph zones, barks. Boss tests set up a situation (a boulder behind the boss, the boss at 50% HP...), end the round, and check what the script did.
