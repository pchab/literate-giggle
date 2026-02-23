import { attackEnemy } from "./applications/attackEnemy.command";
import { moveHero } from "./applications/moveHero.command";

export const heroService = {
	moveHero: moveHero,
	attackEnemy: attackEnemy,
};
