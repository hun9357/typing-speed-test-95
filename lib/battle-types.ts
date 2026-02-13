// === Client → Server Messages ===
export type ClientMessage =
  | { type: "join_queue"; data: { displayName: string } }
  | { type: "join_room"; data: { playerId: string; displayName: string } }
  | { type: "typing_update"; data: TypingProgress }
  | { type: "finished"; data: FinalResult }
  | { type: "request_rematch" }
  | { type: "leave" };

// === Server → Client Messages ===
export type ServerMessage =
  | { type: "waiting"; data: { position: number; playersOnline: number } }
  | {
      type: "matched";
      data: {
        roomId: string;
        passage: string;
        opponent: PlayerInfo;
        yourRole: "player1" | "player2";
      };
    }
  | { type: "countdown"; data: { count: number } }
  | { type: "game_start"; data: { startTime: number } }
  | { type: "opponent_progress"; data: TypingProgress }
  | { type: "opponent_finished"; data: FinalResult }
  | { type: "game_over"; data: BattleResult }
  | { type: "opponent_left" }
  | { type: "rematch_requested"; data: { by: string } }
  | { type: "rematch_start"; data: { roomId: string; passage: string } }
  | { type: "error"; data: { message: string } };

// === Data Types ===
export interface PlayerInfo {
  id: string;
  displayName: string;
}

export interface TypingProgress {
  playerId: string;
  charIndex: number;
  totalChars: number;
  progress: number;
  currentWpm: number;
  currentAccuracy: number;
  timestamp: number;
}

export interface FinalResult {
  playerId: string;
  wpm: number;
  accuracy: number;
  errors: number;
  charsTyped: number;
  completionTime: number;
}

export interface BattleResult {
  winner: string | null;
  players: Record<
    string,
    FinalResult & {
      displayName: string;
      isWinner: boolean;
    }
  >;
  margin: {
    wpmDiff: number;
    accuracyDiff: number;
  };
}

export type BattleState =
  | "idle"
  | "searching"
  | "matched"
  | "countdown"
  | "playing"
  | "finished"
  | "disconnected";
