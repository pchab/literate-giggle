import type { StatusType } from "../domain/status.type";

export type StatusInfo = {
	label: string;
	icon: string;
	description: string;
	/** Tailwind text color for chips. */
	color: string;
	/** Hidden from the card editor (engine-only statuses). */
	internal?: boolean;
};

export const STATUS_INFO: Record<StatusType, StatusInfo> = {
	block: {
		label: "Block",
		icon: "🛡️",
		color: "text-blue-300",
		description: "Absorbs incoming damage.",
	},
	poison: {
		label: "Poison",
		icon: "☠️",
		color: "text-purple-300",
		description: "Loses HP each turn.",
	},
	regen: {
		label: "Regen",
		icon: "🌿",
		color: "text-emerald-300",
		description: "Heals each turn.",
	},
	rooted: {
		label: "Rooted",
		icon: "🪢",
		color: "text-amber-300",
		description: "Cannot move.",
	},
	vulnerable: {
		label: "Vulnerable",
		icon: "⚡",
		color: "text-yellow-300",
		description: "Takes extra damage from each hit.",
	},
	burn: {
		label: "Burn",
		icon: "🔥",
		color: "text-orange-300",
		description: "Loses HP each turn. Removes Chill and Frozen.",
	},
	chill: {
		label: "Chill",
		icon: "❄️",
		color: "text-cyan-300",
		description: "-1 move. At 3 stacks, becomes Frozen. Removes Burn.",
	},
	frozen: {
		label: "Frozen",
		icon: "🧊",
		color: "text-cyan-200",
		description: "Skips its next turn.",
	},
	stun: {
		label: "Stun",
		icon: "💫",
		color: "text-yellow-200",
		description: "Skips its next turn.",
	},
	taunt: {
		label: "Taunt",
		icon: "📣",
		color: "text-red-300",
		description: "Enemies must target this unit first.",
	},
	stealth: {
		label: "Stealth",
		icon: "👤",
		color: "text-zinc-300",
		description: "Enemies can't target it. Lost when dealing a direct hit.",
	},
	haste: {
		label: "Haste",
		icon: "💨",
		color: "text-sky-300",
		description: "+1 move per stack.",
	},
	might: {
		label: "Might",
		icon: "💪",
		color: "text-red-300",
		description: "+1 damage per stack on direct hits.",
	},
	weak: {
		label: "Weak",
		icon: "🥀",
		color: "text-stone-300",
		description: "-1 damage per stack on direct hits.",
	},
	marked: {
		label: "Marked",
		icon: "🎯",
		color: "text-rose-300",
		description: "The next direct hit deals extra damage.",
	},
	thorns: {
		label: "Thorns",
		icon: "🌵",
		color: "text-lime-300",
		description: "Attackers take damage when they hit it.",
	},
	swallowed: {
		label: "Swallowed",
		icon: "👅",
		color: "text-pink-300",
		description: "Swallowed: takes damage every turn until freed.",
		internal: true,
	},
	digesting: {
		label: "Digesting",
		icon: "🍖",
		color: "text-pink-300",
		description: "Spits its prey out after taking this much damage.",
		internal: true,
	},
	unstable_mitosis: {
		label: "Mitosis",
		icon: "🧫",
		color: "text-green-300",
		description:
			"Hits split it into slimes instead of hurting it. Loses 20 HP every turn.",
		internal: true,
	},
};

export const PLAYABLE_STATUS_TYPES = (
	Object.keys(STATUS_INFO) as StatusType[]
).filter((t) => !STATUS_INFO[t].internal);
