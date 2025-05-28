
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Player = 'white' | 'black';
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';

export interface ChessPiece {
  type: PieceType;
  color: Player;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  captured?: ChessPiece;
  notation: string;
  isPromotion?: boolean;
  promotedTo?: PieceType;
  isCastling?: boolean;
  isEnPassant?: boolean;
}

export type BoardState = (ChessPiece | null)[][];
