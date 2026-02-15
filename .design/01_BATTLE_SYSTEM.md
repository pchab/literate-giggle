# BATTLE SYSTEM SPECIFICATION

## THE GRID
* **Dimensions:** 5 Columns (Width) x 3 Rows (Depth).
* **Coordinates:** `[col, row]` where `[0,0]` is Top-Left.
* **Orientation:** * Player Grid: Left side.
    * Enemy Area: Off-grid, Right side.

## MECHANICS
1.  **Lane Targeting:** Enemies attack specific Rows (Lanes).
2.  **Intercepting:** High Defense heroes must move *laterally* into the target lane to block shots.
3.  **Movement:** * Defensive Cards = High Movement.
    * Offensive Cards = Low/No Movement.

## VISUAL LAYOUT (Refer to `battle_ui_mockup.jpg`)
* **Left Panel:** 3 Vertical Slots for Hero Portraits + HP/MP + Cards.
* **Center:** The 5x3 Grid.
* **Right Panel:** Enemy Sprite Area + Enemy Info.