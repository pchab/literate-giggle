import Image from "next/image";

export type UnitType = "Knight" | "Mage" | "Rogue";

interface UnitSpriteProps {
  type: UnitType;
}

const UNIT_ASSETS: Record<UnitType, string> = {
  Knight: "/sprites/warrior_0.png",
  Mage: "/sprites/mage_0.png",
  Rogue: "/sprites/thief_0.png",
};

export function UnitSprite({ type }: UnitSpriteProps) {
  const src = UNIT_ASSETS[type];

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div className="relative w-[180%] h-[180%] -translate-y-4">
        <Image
          src={src}
          alt={type}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
