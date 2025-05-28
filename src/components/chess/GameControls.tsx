
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Undo, Zap } from "lucide-react";

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onAIMove: () => void;
  canUndo: boolean;
  isAIThinking: boolean;
}

export const GameControls = ({
  onReset,
  onUndo,
  onAIMove,
  canUndo,
  isAIThinking
}: GameControlsProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-4">Game Controls</h3>
      <div className="space-y-3">
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        
        <Button 
          onClick={onUndo} 
          disabled={!canUndo}
          variant="outline"
          className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
        >
          <Undo className="w-4 h-4 mr-2" />
          Undo Move
        </Button>
        
        <Button 
          onClick={onAIMove}
          disabled={isAIThinking}
          variant="outline"
          className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
        >
          {isAIThinking ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          {isAIThinking ? "AI Thinking..." : "AI Move"}
        </Button>
      </div>
    </div>
  );
};
