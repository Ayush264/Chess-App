
import { useState, useCallback } from "react";
import type { BoardState, Position, Player, GameStatus, Move, ChessPiece } from "@/types/chess";
import { createInitialBoard, isValidMove, makeMove, getAllPossibleMoves, isInCheck, isCheckmate, isStalemate, getMoveNotation } from "@/utils/chessLogic";
import { getAIMove } from "@/utils/chessAI";

export const useChessGame = () => {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('white');
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isAIThinking, setIsAIThinking] = useState(false);

  const updateGameStatus = useCallback((newBoard: BoardState, player: Player) => {
    if (isInCheck(newBoard, player)) {
      if (isCheckmate(newBoard, player)) {
        setGameStatus('checkmate');
      } else {
        setGameStatus('check');
      }
    } else if (isStalemate(newBoard, player)) {
      setGameStatus('stalemate');
    } else {
      setGameStatus('playing');
    }
  }, []);

  const onSquareClick = useCallback((position: Position) => {
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate') return;

    const piece = board[position.row][position.col];

    if (selectedSquare) {
      // Try to make a move
      if (possibleMoves.some(move => move.row === position.row && move.col === position.col)) {
        const moveData = makeMove(board, selectedSquare, position);
        if (moveData) {
          const notation = getMoveNotation(moveData.move, moveData.newBoard);
          const fullMove: Move = { ...moveData.move, notation };
          
          setBoard(moveData.newBoard);
          setMoveHistory(prev => [...prev, fullMove]);
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
          updateGameStatus(moveData.newBoard, currentPlayer === 'white' ? 'black' : 'white');
        }
      }
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else if (piece && piece.color === currentPlayer) {
      // Select a piece
      setSelectedSquare(position);
      const moves = getAllPossibleMoves(board, position);
      setPossibleMoves(moves);
    }
  }, [board, selectedSquare, possibleMoves, currentPlayer, gameStatus, updateGameStatus]);

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setGameStatus('playing');
    setIsAIThinking(false);
  }, []);

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;
    
    // For simplicity, recreate the board from scratch
    let newBoard = createInitialBoard();
    const movesToReplay = moveHistory.slice(0, -1);
    
    for (const move of movesToReplay) {
      const moveData = makeMove(newBoard, move.from, move.to);
      if (moveData) {
        newBoard = moveData.newBoard;
      }
    }
    
    setBoard(newBoard);
    setMoveHistory(movesToReplay);
    setCurrentPlayer(movesToReplay.length % 2 === 0 ? 'white' : 'black');
    setSelectedSquare(null);
    setPossibleMoves([]);
    updateGameStatus(newBoard, movesToReplay.length % 2 === 0 ? 'white' : 'black');
  }, [moveHistory, updateGameStatus]);

  const makeAIMove = useCallback(async () => {
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate') return;
    
    setIsAIThinking(true);
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiMove = getAIMove(board, currentPlayer);
    if (aiMove) {
      const moveData = makeMove(board, aiMove.from, aiMove.to);
      if (moveData) {
        const notation = getMoveNotation(moveData.move, moveData.newBoard);
        const fullMove: Move = { ...moveData.move, notation };
        
        setBoard(moveData.newBoard);
        setMoveHistory(prev => [...prev, fullMove]);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        updateGameStatus(moveData.newBoard, currentPlayer === 'white' ? 'black' : 'white');
      }
    }
    
    setIsAIThinking(false);
  }, [board, currentPlayer, gameStatus, updateGameStatus]);

  return {
    board,
    currentPlayer,
    selectedSquare,
    possibleMoves,
    moveHistory,
    gameStatus,
    isAIThinking,
    onSquareClick,
    resetGame,
    undoMove,
    makeAIMove
  };
};
