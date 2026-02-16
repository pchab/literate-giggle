import { UnitSprite, type UnitType } from "./UnitSprite";

export interface Unit {
  id: string;
  type: UnitType;
  col: number;
  row: number;
}

interface BattleGridProps {
  units?: Unit[];
}

export function BattleGrid({ units = [] }: BattleGridProps) {
  // 3 columns x 5 rows = 15 cells total
  // Coordinates: (col, row) where col: 0..2, row: 0..4
  const cells = Array.from({ length: 15 }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return { id: `${col}-${row}`, col, row };
  });

  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800 relative">
      {cells.map((cell) => {
        const unitInCell = units.find(
          (u) => u.col === cell.col && u.row === cell.row
        );

        return (
          <div
            key={cell.id}
            className="w-24 h-24 border border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800 transition-colors relative flex items-center justify-center"
            title={`Cell [${cell.col}, ${cell.row}]`}
          >
            {/* Debug/Coordinate overlay - helpful for dev */}
            <span className="text-xs text-zinc-800 select-none absolute top-1 left-1">
              {cell.col},{cell.row}
            </span>

            {/* Render Unit if present */}
            {unitInCell && (
              <div className="absolute inset-0 z-10">
                <UnitSprite type={unitInCell.type} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
