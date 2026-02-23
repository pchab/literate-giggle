import { claimRewardsAndReturnToMap } from "./applications/claimRewardsAndReturnToMap.command";
import { setPhase } from "./applications/setPhase.command";
import { stageBattleRewards } from "./applications/stageBattleRewards.command";
import { travelToNode } from "./applications/travelToNode.command";

export const worldService = {
	setPhase,
	travelToNode,
	stageBattleRewards,
	claimRewardsAndReturnToMap,
};
