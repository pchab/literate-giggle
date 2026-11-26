import { useCampaignStore } from "../store/campaign.store";

/**
 * Story flags that change later content. Kept in one place so it's easy to see
 * which choices have consequences, and where.
 */
export const STORY_FLAGS = {
	// Rats in the Cellar
	cellarSealed: "cellar_sealed", // Rusty Boar remembers you (siege tavern)
	cellarTunnelOpen: "cellar_tunnel_open", // sneak route into the sump
	ratKingEscaped: "rat_king_escaped", // Rat King joins the Giant Toad fight
	rustyBoarSmoked: "rusty_boar_smoked", // smoked the rats out instead of fighting
	// Alchemist's Ledger
	barnabySuspected: "barnaby_suspected",
	barnabyFree: "barnaby_free", // sold him the ledger
	barnabyEscaped: "barnaby_escaped", // lost the fight
	barnabyJailed: "barnaby_jailed",
	barnabyDead: "barnaby_dead",
	mutagenSpreading: "mutagen_spreading", // free or escaped Barnaby → nastier sump & Riverbend
	// Ironhold Sump
	toadEscaped: "toad_escaped", // the toad shows up at Riverbend
	riverbendDoomed: "riverbend_doomed",
	riverbendAllSaved: "riverbend_all_saved",
	riverbendFallen: "riverbend_fallen",
	blackFangsBroken: "black_fangs_broken",
	blackFangsEscaped: "black_fangs_escaped",
} as const;

/** Read a story flag outside React (encounter generators, scripts). */
export const hasStoryFlag = (flag: string) =>
	useCampaignStore.getState().flags.includes(flag);
