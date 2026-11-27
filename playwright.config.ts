import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end tests play the campaign through the real UI.
 * `npm run test:e2e` starts its own dev server (with NEXT_PUBLIC_E2E=1, which exposes
 * the battle store so tests can end fights) on port 3100.
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	workers: process.env.CI ? 2 : 3,
	retries: 1,
	timeout: 4 * 60_000,
	expect: { timeout: 10_000 },
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: `http://localhost:${PORT}`,
		viewport: { width: 1440, height: 900 },
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1440, height: 900 },
				launchOptions: process.env.PW_CHROMIUM_PATH
					? { executablePath: process.env.PW_CHROMIUM_PATH }
					: {},
			},
		},
	],
	webServer: {
		command: `npx next dev -p ${PORT}`,
		env: { NEXT_PUBLIC_E2E: "1" },
		url: `http://localhost:${PORT}/start`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
