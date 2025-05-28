
import { cn } from "@/lib/utils";
import type { ChessPiece, Position } from "@/types/chess";

interface ChessSquareProps {
  piece: ChessPiece | null;
  position: Position;
  isSelected: boolean;
  isPossibleMove: boolean;
  isLight: boolean;
  onClick: (position: Position) => void;
}

const pieceSymbols: Record<string, string> = {
  'white-king': '♔',
  'white-queen': '♕',
  'white-rook': '♖',
  'white-bishop': '♗',
  'white-knight': '♘',
  'white-pawn': '♙',
  'black-king': '♚',
  'black-queen': '♛',
  'black-rook': '♜',
  'black-bishop': '♝',
  'black-knight': '♞',
  'black-pawn': '♟',
};

export const ChessSquare = ({
  piece,
  position,
  isSelected,
  isPossibleMove,
  isLight,
  onClick
}: ChessSquareProps) => {
  const handleClick = () => {
    onClick(position);
  };

  return (
    <div
      className={cn(
        "w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105",
        isLight ? "bg-amber-100" : "bg-amber-800",
        isSelected && "ring-4 ring-blue-500 ring-inset",
        isPossibleMove && "ring-4 ring-green-400 ring-inset",
        "relative"
      )}
      onClick={handleClick}
    >
      {piece && (
        <span className="text-4xl select-none transition-transform duration-200 hover:scale-110">
          {pieceSymbols[`${piece.color}-${piece.type}`]}
        </span>
      )}
      {isPossibleMove && !piece && (
        <div className="w-4 h-4 bg-green-400 rounded-full opacity-70" />
      )}
    </div>
  );
};
