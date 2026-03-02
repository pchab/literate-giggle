import { claimRewards } from "./applications/claimRewards.command";
import { resolvePendingPromotion } from "./applications/resolvePendingPromotion.command";

export const heroClassService = {
	resolvePendingPromotion,
	claimRewards,
};
