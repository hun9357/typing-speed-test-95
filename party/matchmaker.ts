import type * as Party from "partykit/server";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog near the old stone bridge by the river.",
  "Technology has transformed the way we communicate and share information across the globe every single day.",
  "Programming is the art of telling another human what one wants the computer to do efficiently.",
  "In the heart of the city, tall buildings stretch toward the sky while people rush through crowded streets below.",
  "The best way to predict the future is to create it with your own hands and determination.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
  "Learning to write programs stretches your mind and helps you think better about everything around you.",
  "Success is not final and failure is not fatal. It is the courage to continue that truly counts in the end.",
  "The internet has connected billions of people worldwide, making information accessible to anyone with a device.",
  "Artificial intelligence is rapidly changing how businesses operate and how people interact with technology daily.",
  "Good software is like a well-written book. It tells a clear story that anyone can follow and understand.",
  "The mountains rose majestically above the valley, their peaks dusted with the first snow of the season.",
  "Data structures and algorithms form the foundation of computer science and efficient problem solving.",
  "The sun set behind the horizon, painting the sky with brilliant shades of orange, pink, and purple.",
  "Writing clean code is not about following rules blindly, but about communicating your intent clearly.",
  "Remote work has become increasingly popular, allowing people to collaborate from anywhere in the world.",
  "A journey of a thousand miles begins with a single step forward into the unknown territory ahead.",
  "The ocean waves crashed against the rocky shoreline, sending spray high into the cool evening air.",
  "Debugging is twice as hard as writing the code in the first place, so write your code carefully.",
  "Cloud computing has revolutionized how companies store, process, and manage their digital resources.",
  "The library was filled with ancient books, each one holding stories waiting to be discovered by readers.",
  "Open source software has fundamentally changed the way developers collaborate and build applications.",
  "The garden bloomed with colorful flowers, attracting butterflies and bees throughout the warm afternoon.",
  "Version control systems like Git have become essential tools for modern software development teams.",
  "The train sped through the countryside, passing fields of golden wheat swaying gently in the breeze.",
  "Responsive web design ensures that websites look and function well on devices of all shapes and sizes.",
  "The chef carefully prepared each dish with fresh ingredients, creating a masterpiece on every plate.",
  "Continuous integration and deployment pipelines help teams deliver software updates faster and safer.",
  "The stars twinkled brightly in the clear night sky, forming patterns that have guided travelers for ages.",
  "TypeScript adds static type checking to JavaScript, helping developers catch errors before runtime.",
];

interface WaitingPlayer {
  id: string;
  displayName: string;
}

export default class MatchMaker implements Party.Server {
  waitingQueue: WaitingPlayer[] = [];
  connections: Map<string, Party.Connection> = new Map();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    this.connections.set(conn.id, conn);
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const msg = JSON.parse(message);

      if (msg.type === "join_queue") {
        const player: WaitingPlayer = {
          id: sender.id,
          displayName: msg.data?.displayName || "Anonymous",
        };

        const existing = this.waitingQueue.find((p) => p.id === sender.id);
        if (!existing) {
          this.waitingQueue.push(player);
        }

        sender.send(
          JSON.stringify({
            type: "waiting",
            data: {
              position: this.waitingQueue.length,
              playersOnline: this.connections.size,
            },
          })
        );

        this.tryMatch();
      }

      if (msg.type === "leave") {
        this.waitingQueue = this.waitingQueue.filter(
          (p) => p.id !== sender.id
        );
      }
    } catch {
      // ignore malformed messages
    }
  }

  onClose(conn: Party.Connection) {
    this.waitingQueue = this.waitingQueue.filter((p) => p.id !== conn.id);
    this.connections.delete(conn.id);
  }

  tryMatch() {
    while (this.waitingQueue.length >= 2) {
      const p1 = this.waitingQueue.shift()!;
      const p2 = this.waitingQueue.shift()!;

      const roomId = `battle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const passage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];

      const conn1 = this.connections.get(p1.id);
      const conn2 = this.connections.get(p2.id);

      if (conn1) {
        conn1.send(
          JSON.stringify({
            type: "matched",
            data: {
              roomId,
              passage,
              opponent: { id: p2.id, displayName: p2.displayName },
              yourRole: "player1",
            },
          })
        );
      }

      if (conn2) {
        conn2.send(
          JSON.stringify({
            type: "matched",
            data: {
              roomId,
              passage,
              opponent: { id: p1.id, displayName: p1.displayName },
              yourRole: "player2",
            },
          })
        );
      }
    }
  }
}
