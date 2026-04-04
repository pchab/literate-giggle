import type { CardEffect } from "@/modules/cards/domain/cards.type";

export interface EffectInputProps<T extends CardEffect> {
	effect: T;
	onChange: (updates: Partial<T>) => void;
}
