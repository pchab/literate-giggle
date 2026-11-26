// Dependency-free so class data can reference passives without import cycles.
export const PASSIVE_IDS = {
	scavenger: "scavenger",
	hold_the_line: "hold_the_line",
	bulwark: "bulwark",
	bloodlust: "bloodlust",
	backstab: "backstab",
	steady_aim: "steady_aim",
	spell_focus: "spell_focus",
	devotion: "devotion",
} as const;

export type PassiveId = (typeof PASSIVE_IDS)[keyof typeof PASSIVE_IDS];
