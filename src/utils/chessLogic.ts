
import type { BoardState, Position, Player, ChessPiece, Move } from "@/types/chess";

export const createInitialBoard = (): BoardState => {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Place other pieces
  const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'] as const;
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRank[col], color: 'black' };
    board[7][col] = { type: backRank[col], color: 'white' };
  }

  return board;
};

export const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

// This function gets all possible moves WITHOUT checking for king safety (to avoid recursion)
const getAllPossibleMovesUnsafe = (board: BoardState, from: Position): Position[] => {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const moves: Position[] = [];

  switch (piece.type) {
    case 'pawn':
      moves.push(...getPawnMoves(board, from, piece.color));
      break;
    case 'rook':
      moves.push(...getRookMoves(board, from, piece.color));
      break;
    case 'knight':
      moves.push(...getKnightMoves(board, from, piece.color));
      break;
    case 'bishop':
      moves.push(...getBishopMoves(board, from, piece.color));
      break;
    case 'queen':
      moves.push(...getQueenMoves(board, from, piece.color));
      break;
    case 'king':
      moves.push(...getKingMoves(board, from, piece.color));
      break;
  }

  return moves.filter(move => isValidPosition(move));
};

// This function gets all legal moves WITH king safety check
export const getAllPossibleMoves = (board: BoardState, from: Position): Position[] => {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const unsafeMoves = getAllPossibleMovesUnsafe(board, from);
  return unsafeMoves.filter(move => !wouldBeInCheck(board, from, move, piece.color));
};

const getPawnMoves = (board: BoardState, from: Position, color: Player): Position[] => {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  // Forward move
  const oneStep = { row: from.row + direction, col: from.col };
  if (isValidPosition(oneStep) && !board[oneStep.row][oneStep.col]) {
    moves.push(oneStep);

    // Two steps from starting position
    if (from.row === startRow) {
      const twoSteps = { row: from.row + 2 * direction, col: from.col };
      if (isValidPosition(twoSteps) && !board[twoSteps.row][twoSteps.col]) {
        moves.push(twoSteps);
      }
    }
  }

  // Diagonal captures
  for (const colOffset of [-1, 1]) {
    const capturePos = { row: from.row + direction, col: from.col + colOffset };
    if (isValidPosition(capturePos)) {
      const targetPiece = board[capturePos.row][capturePos.col];
      if (targetPiece && targetPiece.color !== color) {
        moves.push(capturePos);
      }
    }
  }

  return moves;
};

const getRookMoves = (board: BoardState, from: Position, color: Player): Position[] => {
  const moves: Position[] = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const pos = { row: from.row + i * dRow, col: from.col + i * dCol };
      if (!isValidPosition(pos)) break;

      const piece = board[pos.row][pos.col];
      if (!piece) {
        moves.push(pos);
      } else {
        if (piece.color !== color) moves.push(pos);
        break;
      }
    }
  }

  return moves;
};

const getKnightMoves = (board: BoardState, from: Position, color: Player): Position[] => {
  const moves: Position[] = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  for (const [dRow, dCol] of knightMoves) {
    const pos = { row: from.row + dRow, col: from.col + dCol };
    if (isValidPosition(pos)) {
      const piece = board[pos.row][pos.col];
      if (!piece || piece.color !== color) {
        moves.push(pos);
      }
    }
  }

  return moves;
};

const getBishopMoves = (board: BoardState, from: Position, color: Player): Position[] => {
  const moves: Position[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

  for (const [dRow, dCol] of directions) {
    for (let i = 1; i < 8; i++) {
      const pos = { row: from.row + i * dRow, col: from.col + i * dCol };
      if (!isValidPosition(pos)) break;

      const piece = board[pos.row][pos.col];
      if (!piece) {
        moves.push(pos);
      } else {
        if (piece.color !== color) moves.push(pos);
        break;
      }
    }
  }

  return moves;
};

const getQueenMoves = (board: BoardState, from: Position, color: Player): Position[] => {
  return [...getRookMoves(board, from, color), ...getBishopMoves(board, from, color)];
};

const getKingMoves = (board: BoardState, from: Position, color: Player): Position[] => {
  const moves: Position[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dRow, dCol] of directions) {
    const pos = { row: from.row + dRow, col: from.col + dCol };
    if (isValidPosition(pos)) {
      const piece = board[pos.row][pos.col];
      if (!piece || piece.color !== color) {
        moves.push(pos);
      }
    }
  }

  return moves;
};

export const isValidMove = (board: BoardState, from: Position, to: Position): boolean => {
  const possibleMoves = getAllPossibleMoves(board, from);
  return possibleMoves.some(move => move.row === to.row && move.col === to.col);
};

export const makeMove = (board: BoardState, from: Position, to: Position): { newBoard: BoardState; move: Move } | null => {
  if (!isValidMove(board, from, to)) return null;

  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  const captured = newBoard[to.row][to.col];

  if (!piece) return null;

  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  const move: Move = {
    from,
    to,
    piece,
    captured: captured || undefined,
    notation: '' // Will be filled by the caller
  };

  return { newBoard, move };
};

const findKing = (board: BoardState, color: Player): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

export const isInCheck = (board: BoardState, color: Player): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const enemyColor = color === 'white' ? 'black' : 'white';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === enemyColor) {
        const moves = getAllPossibleMovesUnsafe(board, { row, col });
        if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
          return true;
        }
      }
    }
  }

  return false;
};

const wouldBeInCheck = (board: BoardState, from: Position, to: Position, color: Player): boolean => {
  const testBoard = board.map(row => [...row]);
  const piece = testBoard[from.row][from.col];

  testBoard[to.row][to.col] = piece;
  testBoard[from.row][from.col] = null;

  return isInCheck(testBoard, color);
};

export const isCheckmate = (board: BoardState, color: Player): boolean => {
  if (!isInCheck(board, color)) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getAllPossibleMoves(board, { row, col });
        if (moves.length > 0) return false;
      }
    }
  }

  return true;
};

export const isStalemate = (board: BoardState, color: Player): boolean => {
  if (isInCheck(board, color)) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getAllPossibleMoves(board, { row, col });
        if (moves.length > 0) return false;
      }
    }
  }

  return true;
};

export const getMoveNotation = (move: Move, board: BoardState): string => {
  const { piece, from, to, captured } = move;
  
  const files = 'abcdefgh';
  const fromSquare = `${files[from.col]}${8 - from.row}`;
  const toSquare = `${files[to.col]}${8 - to.row}`;
  
  if (piece.type === 'pawn') {
    if (captured) {
      return `${files[from.col]}x${toSquare}`;
    }
    return toSquare;
  }
  
  const pieceSymbol = piece.type.charAt(0).toUpperCase();
  const captureSymbol = captured ? 'x' : '';
  
  return `${pieceSymbol}${captureSymbol}${toSquare}`;
};
