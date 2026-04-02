import type { UnitSpriteVariant } from "../domain/units.type";

export const spriteVariants: Record<UnitSpriteVariant, string> = {
	// --- BASE ---
	default: "none",

	// --- STANDARD COLOR SHIFTS (Great for clothes/hair) ---
	// Note: Exactly what color these become depends on your base sprite's colors!
	variant_ruby: "hue-rotate(-45deg) saturate(1.2)",
	variant_emerald: "hue-rotate(90deg) saturate(1.1)",
	variant_sapphire: "hue-rotate(180deg)",
	variant_amethyst: "hue-rotate(240deg) saturate(1.3)",
	variant_sunset: "hue-rotate(45deg) saturate(1.5) brightness(0.9)",

	// --- THEMATIC & TACTICAL SHIFTS ---
	// The "Elite" Enemy (Makes them look shiny and golden)
	elite_gold: "sepia(1) saturate(3) hue-rotate(5deg) brightness(1.1)",

	// The "Shadow" Variant (Great for stealth units or night-time encounters)
	shadow: "brightness(0.55) contrast(1.3) saturate(0.7)",

	// The "Sickly/Undead" Variant (Perfect for making zombie hordes look diverse)
	undead_pale: "saturate(0.3) brightness(1.2) hue-rotate(15deg)",
	undead_toxic: "sepia(1) hue-rotate(70deg) saturate(2.5) brightness(0.9)", // Forces a sickly radioactive green

	// The "Ghostly" Variant (Transparent, glowing blue)
	ethereal:
		"sepia(1) hue-rotate(180deg) saturate(2) opacity(0.7) brightness(1.2)",
};
