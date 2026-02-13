import PartySocket from "partysocket";
import type { ServerMessage, ClientMessage } from "./battle-types";

const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999";

export function createMatchmakerSocket(
  onMessage: (msg: ServerMessage) => void
): PartySocket {
  const socket = new PartySocket({
    host: PARTYKIT_HOST,
    party: "matchmaker",
    room: "lobby",
  });

  socket.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data) as ServerMessage;
      onMessage(msg);
    } catch {
      // ignore
    }
  });

  return socket;
}

export function createBattleSocket(
  roomId: string,
  onMessage: (msg: ServerMessage) => void
): PartySocket {
  const socket = new PartySocket({
    host: PARTYKIT_HOST,
    party: "battle",
    room: roomId,
  });

  socket.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data) as ServerMessage;
      onMessage(msg);
    } catch {
      // ignore
    }
  });

  return socket;
}

export function sendMessage(
  socket: PartySocket,
  message: ClientMessage
): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
