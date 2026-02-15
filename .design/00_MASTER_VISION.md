# PROJECT: (Tactical JRPG)

## CORE PILLARS
1.  **Genre:** Tactical Turn-Based JRPG (NOT a Roguelike. Persistent Party).
2.  **Visual Style:** Side-view, hand-drawn dark fantasy, UI-heavy.
3.  **Key Hook:** Positioning Matters. 5-Column Tall Grid. Lane Control.

## ARCHITECTURE
* **Engine:** HTML5 Canvas / React / TypeScript.
* **State Management:** Zustand (Single Source of Truth).
* **Data:** JSON-driven definitions for Cards, Enemies, and Heroes.

## 🛑 NEGATIVE CONSTRAINTS (DO NOT DO)
* No "Runs" or Permadeath loops.
* No Procedural Map Generation (Use fixed Nodes/Towns).
* No Top-Down movement (Side-view Diorama only).