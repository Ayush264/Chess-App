
import type { BoardState, Position, Player, Move } from "@/types/chess";
import { getAllPossibleMoves, makeMove, isInCheck, isCheckmate } from "./chessLogic";

const pieceValues = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

export const getAIMove = (board: BoardState, color: Player): { from: Position; to: Position } | null => {
  const allMoves: { from: Position; to: Position; score: number }[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const from = { row, col };
        const possibleMoves = getAllPossibleMoves(board, from);
        
        for (const to of possibleMoves) {
          const moveData = makeMove(board, from, to);
          if (moveData) {
            const score = evaluatePosition(moveData.newBoard, color);
            allMoves.push({ from, to, score });
          }
        }
      }
    }
  }

  if (allMoves.length === 0) return null;

  // Sort moves by score (best first)
  allMoves.sort((a, b) => b.score - a.score);

  // Add some randomness to make AI less predictable
  const topMoves = allMoves.slice(0, Math.min(3, allMoves.length));
  const randomMove = topMoves[Math.floor(Math.random() * topMoves.length)];

  return { from: randomMove.from, to: randomMove.to };
};

const evaluatePosition = (board: BoardState, color: Player): number => {
  let score = 0;
  const enemyColor = color === 'white' ? 'black' : 'white';

  // Material evaluation
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = pieceValues[piece.type];
        if (piece.color === color) {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }

  // Position evaluation
  score += evaluateKingSafety(board, color) - evaluateKingSafety(board, enemyColor);
  score += evaluateCenterControl(board, color) - evaluateCenterControl(board, enemyColor);

  // Check for checkmate (high priority)
  if (isCheckmate(board, enemyColor)) {
    score += 1000;
  } else if (isCheckmate(board, color)) {
    score -= 1000;
  }

  // Check penalty
  if (isInCheck(board, color)) {
    score -= 5;
  } else if (isInCheck(board, enemyColor)) {
    score += 5;
  }

  return score;
};

const evaluateKingSafety = (board: BoardState, color: Player): number => {
  let safety = 0;
  
  // Find king position
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingPos = { row, col };
        break;
      }
    }
  }

  if (!kingPos) return 0;

  // Prefer king near back rank in opening/middlegame
  const backRank = color === 'white' ? 7 : 0;
  safety += Math.abs(kingPos.row - backRank) * -0.5;

  return safety;
};

const evaluateCenterControl = (board: BoardState, color: Player): number => {
  let control = 0;
  const centerSquares = [
    { row: 3, col: 3 }, { row: 3, col: 4 },
    { row: 4, col: 3 }, { row: 4, col: 4 }
  ];

  for (const square of centerSquares) {
    const piece = board[square.row][square.col];
    if (piece && piece.color === color) {
      control += 0.5;
    }
  }

  return control;
};
