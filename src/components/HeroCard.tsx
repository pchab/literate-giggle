import Image from "next/image";
import type { CardProps } from "./Card";
import { Hand } from "./Hand";
import { HeroPortrait } from "./HeroPortrait";

const DUMMY_HAND: CardProps[] = [
    { id: "c1", title: "Strike" },
    { id: "c2", title: "Defend" },
    { id: "c3", title: "Heal" },
];

export function HeroCard({ classType }: { classType: string }) {
    return (
        <div className="relative flex flex-col">
            <Image src="/hero_card.png" alt="Hero" 
            layout="fill" className="absolute inset-0 z-O"/>
            <div className="flex z-10 justify-center items-center">
                <HeroPortrait classType={classType} />
                <Hand cards={DUMMY_HAND} />
            </div>
        </div>
    )
}