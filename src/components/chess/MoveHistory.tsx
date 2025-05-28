
import type { Move } from "@/types/chess";

interface MoveHistoryProps {
  moves: Move[];
}

export const MoveHistory = ({ moves }: MoveHistoryProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-4">Move History</h3>
      <div className="max-h-64 overflow-y-auto">
        {moves.length === 0 ? (
          <p className="text-slate-300 text-sm">No moves yet</p>
        ) : (
          <div className="space-y-1">
            {moves.map((move, index) => (
              <div key={index} className="text-sm text-slate-200 flex justify-between">
                <span>{Math.floor(index / 2) + 1}.</span>
                <span>{move.notation}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
