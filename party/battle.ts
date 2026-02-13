import type * as Party from "partykit/server";

interface PlayerData {
  id: string;
  displayName: string;
  progress: {
    charIndex: number;
    totalChars: number;
    progress: number;
    currentWpm: number;
    currentAccuracy: number;
  } | null;
  result: {
    wpm: number;
    accuracy: number;
    errors: number;
    charsTyped: number;
    completionTime: number;
  } | null;
}

type RoomStatus = "waiting" | "countdown" | "playing" | "finished";

export default class BattleRoom implements Party.Server {
  players: Map<string, PlayerData> = new Map();
  status: RoomStatus = "waiting";
  startTime: number | null = null;
  countdownTimer: ReturnType<typeof setTimeout> | null = null;
  gameTimer: ReturnType<typeof setTimeout> | null = null;
  passage: string = "";

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    // player joins via message
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const msg = JSON.parse(message);

      switch (msg.type) {
        case "join_room":
          this.handleJoin(sender, msg.data);
          break;
        case "typing_update":
          this.handleTypingUpdate(sender, msg.data);
          break;
        case "finished":
          this.handleFinished(sender, msg.data);
          break;
        case "request_rematch":
          this.handleRematch(sender);
          break;
        case "leave":
          this.handleLeave(sender);
          break;
      }
    } catch {
      // ignore
    }
  }

  handleJoin(
    conn: Party.Connection,
    data: { playerId: string; displayName: string }
  ) {
    this.players.set(conn.id, {
      id: conn.id,
      displayName: data.displayName || "Player",
      progress: null,
      result: null,
    });

    if (this.players.size === 2) {
      this.startCountdown();
    }
  }

  startCountdown() {
    this.status = "countdown";
    let count = 3;

    const tick = () => {
      this.broadcast({ type: "countdown", data: { count } });

      if (count === 0) {
        setTimeout(() => this.startGame(), 400);
      } else {
        count--;
        this.countdownTimer = setTimeout(tick, 1000);
      }
    };

    tick();
  }

  startGame() {
    this.status = "playing";
    this.startTime = Date.now();

    this.broadcast({
      type: "game_start",
      data: { startTime: this.startTime },
    });

    // Force end after 60 seconds
    this.gameTimer = setTimeout(() => {
      this.endGame();
    }, 61000);
  }

  handleTypingUpdate(
    sender: Party.Connection,
    data: {
      charIndex: number;
      totalChars: number;
      progress: number;
      currentWpm: number;
      currentAccuracy: number;
    }
  ) {
    if (this.status !== "playing") return;

    // Anti-cheat: reject WPM > 200
    if (data.currentWpm > 200) return;

    const player = this.players.get(sender.id);
    if (player) {
      player.progress = data;
    }

    // Relay to opponent
    this.broadcastExcept(sender.id, {
      type: "opponent_progress",
      data: {
        playerId: sender.id,
        ...data,
        timestamp: Date.now(),
      },
    });
  }

  handleFinished(
    sender: Party.Connection,
    data: {
      wpm: number;
      accuracy: number;
      errors: number;
      charsTyped: number;
      completionTime: number;
    }
  ) {
    if (this.status !== "playing") return;
    if (data.wpm > 200) return;

    const player = this.players.get(sender.id);
    if (player) {
      player.result = data;
    }

    this.broadcastExcept(sender.id, {
      type: "opponent_finished",
      data: { playerId: sender.id, ...data },
    });

    const allDone = [...this.players.values()].every((p) => p.result !== null);
    if (allDone) {
      this.endGame();
    }
  }

  endGame() {
    if (this.status === "finished") return;
    this.status = "finished";

    if (this.gameTimer) clearTimeout(this.gameTimer);
    if (this.countdownTimer) clearTimeout(this.countdownTimer);

    const playerEntries = [...this.players.entries()];
    const results: Record<
      string,
      {
        playerId: string;
        displayName: string;
        wpm: number;
        accuracy: number;
        errors: number;
        charsTyped: number;
        completionTime: number;
        isWinner: boolean;
      }
    > = {};

    for (const [id, p] of playerEntries) {
      results[id] = {
        playerId: id,
        displayName: p.displayName,
        wpm: p.result?.wpm ?? 0,
        accuracy: p.result?.accuracy ?? 0,
        errors: p.result?.errors ?? 0,
        charsTyped: p.result?.charsTyped ?? 0,
        completionTime: p.result?.completionTime ?? 60000,
        isWinner: false,
      };
    }

    // Determine winner: highest WPM, then highest accuracy
    const sorted = Object.values(results).sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      return b.accuracy - a.accuracy;
    });

    let winner: string | null = null;
    if (sorted.length >= 2) {
      if (sorted[0].wpm === sorted[1].wpm && sorted[0].accuracy === sorted[1].accuracy) {
        winner = null; // draw
      } else {
        winner = sorted[0].playerId;
        results[sorted[0].playerId].isWinner = true;
      }
    }

    const wpmDiff =
      sorted.length >= 2 ? Math.abs(sorted[0].wpm - sorted[1].wpm) : 0;
    const accDiff =
      sorted.length >= 2
        ? Math.abs(sorted[0].accuracy - sorted[1].accuracy)
        : 0;

    this.broadcast({
      type: "game_over",
      data: {
        winner,
        players: results,
        margin: { wpmDiff, accuracyDiff: accDiff },
      },
    });
  }

  handleRematch(sender: Party.Connection) {
    this.broadcastExcept(sender.id, {
      type: "rematch_requested",
      data: { by: sender.id },
    });
  }

  handleLeave(sender: Party.Connection) {
    this.players.delete(sender.id);
    this.broadcastExcept(sender.id, { type: "opponent_left" });
  }

  onClose(conn: Party.Connection) {
    this.players.delete(conn.id);
    this.broadcastExcept(conn.id, { type: "opponent_left" });
  }

  broadcast(msg: Record<string, unknown>) {
    const str = JSON.stringify(msg);
    for (const conn of this.room.getConnections()) {
      conn.send(str);
    }
  }

  broadcastExcept(excludeId: string, msg: Record<string, unknown>) {
    const str = JSON.stringify(msg);
    for (const conn of this.room.getConnections()) {
      if (conn.id !== excludeId) {
        conn.send(str);
      }
    }
  }
}
