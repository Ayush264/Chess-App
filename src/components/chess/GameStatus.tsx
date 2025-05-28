
import type { Player, GameStatus as GameStatusType } from "@/types/chess";
import { Loader2 } from "lucide-react";

interface GameStatusProps {
  currentPlayer: Player;
  gameStatus: GameStatusType;
  isAIThinking: boolean;
}

export const GameStatus = ({ currentPlayer, gameStatus, isAIThinking }: GameStatusProps) => {
  const getStatusText = () => {
    if (isAIThinking) return "AI is thinking...";
    
    switch (gameStatus) {
      case 'checkmate':
        return `Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`;
      case 'stalemate':
        return "Stalemate! It's a draw.";
      case 'check':
        return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
      default:
        return `${currentPlayer === 'white' ? 'White' : 'Black'} to move`;
    }
  };

  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 text-white text-lg font-medium">
        {isAIThinking && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{getStatusText()}</span>
      </div>
    </div>
  );
};
