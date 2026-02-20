"use client";

import { redirect } from "next/navigation";
import MapScreen from "@/components/MapScreen";
import { useBattleStore } from "@/store/battle.store";
import { useWorldStore } from "@/store/world.store";

export default function WorldScreen() {
    const { phase, roster } = useWorldStore();
    const { initBattle } = useBattleStore();

    if (phase === 'BATTLE') {
        initBattle(roster);
        redirect('/');
    }

    return <MapScreen />;
}
