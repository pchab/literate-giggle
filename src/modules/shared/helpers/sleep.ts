export const sleep = (ms: number) =>
	ms > 0 && new Promise((resolve) => setTimeout(resolve, ms));
