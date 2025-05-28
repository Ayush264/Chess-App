
import { useState } from "react";
import { ChessBoard } from "./ChessBoard";
import { GameControls } from "./GameControls";
import { MoveHistory } from "./MoveHistory";
import { GameStatus } from "./GameStatus";
import { useChessGame } from "@/hooks/useChessGame";

export const ChessGame = () => {
  const {
    board,
    currentPlayer,
    selectedSquare,
    possibleMoves,
    moveHistory,
    gameStatus,
    onSquareClick,
    resetGame,
    undoMove,
    makeAIMove,
    isAIThinking
  } = useChessGame();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
            <GameStatus 
              currentPlayer={currentPlayer} 
              gameStatus={gameStatus}
              isAIThinking={isAIThinking}
            />
            <ChessBoard
              board={board}
              selectedSquare={selectedSquare}
              possibleMoves={possibleMoves}
              onSquareClick={onSquareClick}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <GameControls
            onReset={resetGame}
            onUndo={undoMove}
            onAIMove={makeAIMove}
            canUndo={moveHistory.length > 0}
            isAIThinking={isAIThinking}
          />
          <MoveHistory moves={moveHistory} />
        </div>
      </div>
    </div>
  );
};
