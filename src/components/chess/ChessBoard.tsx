
import { ChessSquare } from "./ChessSquare";
import type { BoardState, Position } from "@/types/chess";

interface ChessBoardProps {
  board: BoardState;
  selectedSquare: Position | null;
  possibleMoves: Position[];
  onSquareClick: (position: Position) => void;
}

export const ChessBoard = ({ 
  board, 
  selectedSquare, 
  possibleMoves, 
  onSquareClick 
}: ChessBoardProps) => {
  return (
    <div className="inline-block border-4 border-amber-700 rounded-lg shadow-2xl">
      <div className="grid grid-cols-8 gap-0">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position: Position = { row: rowIndex, col: colIndex };
            const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
            const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;

            return (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={position}
                isSelected={isSelected}
                isPossibleMove={isPossibleMove}
                isLight={isLight}
                onClick={onSquareClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
