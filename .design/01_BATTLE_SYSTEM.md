# BATTLE SYSTEM SPECIFICATION

## THE GRID
* **Dimensions:** 3 Columns (Width) x 5 Rows (Depth).
* **Coordinates:** `[col, row]` where `[0,0]` is Top-Left.
* **Orientation:** * Player Grid: Left side.
    * Enemy Area: Off-grid, Right side.

## MECHANICS
1.  **Lane Targeting:** Enemies attack specific Rows (Lanes).
2.  **Intercepting:** High Defense heroes must move *laterally* into the target lane to block shots.
3.  **Movement:** * Defensive Cards = High Movement.
    * Heal/Offensive Cards = Low/No Movement.

## VISUAL LAYOUT (Refer to `battle_ui_mockup.jpg`)
* **Left Panel:** 3 Vertical Slots for Hero Portraits + 3 Cards.
* **Center:** The 3x5 Grid. (3 columns, 5 rows)
* **Right Panel:** Enemy Sprite Area + Enemy Info.