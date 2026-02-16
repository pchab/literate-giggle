export function BattleGrid() {
  // 3 columns x 5 rows = 15 cells total
  // Coordinates: (col, row) where col: 0..2, row: 0..4
  const cells = Array.from({ length: 15 }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return { id: `${col}-${row}`, col, row };
  });

  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="w-24 h-24 border border-zinc-700/50 bg-zinc-900/30 hover:bg-zinc-800 transition-colors relative flex items-center justify-center"
          title={`Cell [${cell.col}, ${cell.row}]`}
        >
          {/* Debug/Coordinate overlay - helpful for dev */}
          <span className="text-xs text-zinc-800 select-none">
            {cell.col},{cell.row}
          </span>
        </div>
      ))}
    </div>
  );
}
