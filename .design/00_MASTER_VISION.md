# PROJECT: (Tactical JRPG)

## CORE PILLARS
1.  **Genre:** Tactical Cards Turn-Based.
2.  **Visual Style:** Side-view, hand-drawn dark fantasy, UI-heavy.
3.  **Key Hook:** Positioning Matters. 3-Column tall, 3 Rows wide Grid. Lane Control.

## ARCHITECTURE
* **Engine:** HTML5 Canvas / React / TypeScript.
* **State Management:** Zustand (Single Source of Truth).
* **Data:** JSON-driven definitions for Cards, Enemies, and Heroes.

## GAMEPLAY
* **Turn-based:** Players take turns playing cards to attack, defend, or use skills.
* **Positioning:** The enemies are in their own area on the right. They make AoE attacks on the player grid. The player can position their heroes in a 3x5 grid to block incoming hits.
* **Stats:** Physical Attack, Physical Defense, Magical Attack, Magical Defense, Health.
* **Starting Cards:**
    * **Physical Attack:** Deals physical damage to an enemy.
    * **Physical Defense:** Reduces incoming physical damage.
    * **Magical Attack:** Deals magical damage to an enemy.
    * **Magical Defense:** Reduces incoming magical damage.
    * **Heal:** Heals a hero.
* **Leveling:** Using cards increase their power. At certain thresholds, the card is replaced with a choice of 2-3 stronger versions of itself. Hero class changes depending on the strongest cards of the hero.
