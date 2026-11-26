import type { UnitSpriteVariant } from "../domain/units.type";

export type HeroColor = {
	label: string;
	/** Target hue for the clothes recolour. null = keep the sprite's own colours. */
	hue: number | null;
	/** UI accent: name plates, foot ring, panel borders. */
	hex: string;
};

/**
 * Each hero's `variant` doubles as their signature colour, so existing saves
 * (default / ruby / emerald) get an identity without migration.
 */
export const HERO_PALETTE: Partial<Record<UnitSpriteVariant, HeroColor>> = {
	default: { label: "Umber", hue: null, hex: "#d6a35c" },
	variant_ruby: { label: "Crimson", hue: 355, hex: "#ef4444" },
	variant_emerald: { label: "Forest", hue: 130, hex: "#22c55e" },
	variant_sapphire: { label: "Royal", hue: 220, hex: "#3b82f6" },
	variant_amethyst: { label: "Violet", hue: 275, hex: "#a855f7" },
	variant_sunset: { label: "Ochre", hue: 40, hex: "#f59e0b" },
};

export const getHeroColor = (variant?: UnitSpriteVariant): HeroColor =>
	HERO_PALETTE[variant ?? "default"] ?? (HERO_PALETTE.default as HeroColor);
