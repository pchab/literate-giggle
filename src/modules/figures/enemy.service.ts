"use server";

import { enemyAction } from "./applications/enemyAction.command";

export const enemyService = {
	enemyAction: enemyAction,
};
