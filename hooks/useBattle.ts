"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  BattleState,
  PlayerInfo,
  TypingProgress,
  FinalResult,
  BattleResult,
  ServerMessage,
} from "@/lib/battle-types";

const BATTLE_PASSAGES = [
  "The quick brown fox jumps over the lazy dog near the old stone bridge by the river.",
  "Technology has transformed the way we communicate and share information across the globe every single day.",
  "Programming is the art of telling another human what one wants the computer to do efficiently.",
  "In the heart of the city, tall buildings stretch toward the sky while people rush through crowded streets.",
  "The best way to predict the future is to create it with your own hands and determination.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they did.",
  "Learning to write programs stretches your mind and helps you think better about everything around you.",
  "Success is not final and failure is not fatal. It is the courage to continue that truly counts in the end.",
  "The internet has connected billions of people worldwide, making information accessible to anyone with a device.",
  "Artificial intelligence is rapidly changing how businesses operate and how people interact with technology.",
];

const BOT_NAMES = [
  "SpeedTyper42",
  "KeyboardNinja",
  "TypeMaster_X",
  "SwiftFingers",
  "ProTypist99",
  "FlashKeys",
  "RapidType",
  "TurboTyper",
];

// Local simulation mode (set false when PartyKit server is deployed)
const USE_LOCAL_SIM = true;

export function useBattle() {
  const [state, setState] = useState<BattleState>("idle");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [passage, setPassage] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<PlayerInfo | null>(null);
  const [myProgress, setMyProgress] = useState<TypingProgress | null>(null);
  const [opponentProgress, setOpponentProgress] =
    useState<TypingProgress | null>(null);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [searchTime, setSearchTime] = useState(0);
  const [myDisplayName] = useState("You");

  const searchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botProgressRef = useRef({ charIndex: 0, errors: 0 });

  const cleanup = useCallback(() => {
    if (searchTimerRef.current) clearInterval(searchTimerRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    if (matchTimeoutRef.current) clearTimeout(matchTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    searchTimerRef.current = null;
    botIntervalRef.current = null;
    matchTimeoutRef.current = null;
    countdownIntervalRef.current = null;
    gameTimerRef.current = null;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const simulateOpponent = useCallback(
    (passageText: string) => {
      const botWpm = 35 + Math.random() * 45; // 35-80 WPM
      const charsPerSecond = (botWpm * 5) / 60;
      const totalChars = passageText.length;
      botProgressRef.current = { charIndex: 0, errors: 0 };

      botIntervalRef.current = setInterval(() => {
        const ref = botProgressRef.current;
        const increment = charsPerSecond * 0.5 + (Math.random() - 0.3) * 2;
        ref.charIndex = Math.min(ref.charIndex + increment, totalChars);

        if (Math.random() < 0.03) ref.errors++;

        const progress = (ref.charIndex / totalChars) * 100;
        const accuracy =
          ref.charIndex > 0
            ? ((ref.charIndex - ref.errors) / ref.charIndex) * 100
            : 100;

        setOpponentProgress({
          playerId: "bot",
          charIndex: Math.floor(ref.charIndex),
          totalChars,
          progress: Math.min(progress, 100),
          currentWpm: Math.floor(botWpm + (Math.random() - 0.5) * 10),
          currentAccuracy: Math.max(Math.floor(accuracy * 10) / 10, 85),
          timestamp: Date.now(),
        });

        if (ref.charIndex >= totalChars) {
          if (botIntervalRef.current) clearInterval(botIntervalRef.current);
        }
      }, 500);
    },
    []
  );

  const startCountdown = useCallback(
    (passageText: string) => {
      setState("countdown");
      let count = 3;
      setCountdownValue(count);

      countdownIntervalRef.current = setInterval(() => {
        count--;
        setCountdownValue(count);

        if (count <= 0) {
          if (countdownIntervalRef.current)
            clearInterval(countdownIntervalRef.current);

          setTimeout(() => {
            setState("playing");
            simulateOpponent(passageText);
          }, 400);
        }
      }, 1000);
    },
    [simulateOpponent]
  );

  const findOpponent = useCallback(
    (displayName?: string) => {
      if (USE_LOCAL_SIM) {
        setState("searching");
        setSearchTime(0);
        setResult(null);
        setOpponentProgress(null);
        setMyProgress(null);
        botProgressRef.current = { charIndex: 0, errors: 0 };

        searchTimerRef.current = setInterval(() => {
          setSearchTime((t) => t + 1);
        }, 1000);

        const delay = 2000 + Math.random() * 3000;
        matchTimeoutRef.current = setTimeout(() => {
          if (searchTimerRef.current) clearInterval(searchTimerRef.current);

          const botName =
            BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
          const selectedPassage =
            BATTLE_PASSAGES[
              Math.floor(Math.random() * BATTLE_PASSAGES.length)
            ];

          setOpponent({ id: "bot", displayName: botName });
          setPassage(selectedPassage);
          setRoomId(`local-${Date.now()}`);
          setState("matched");

          setTimeout(() => startCountdown(selectedPassage), 1200);
        }, delay);
      }
      // TODO: PartyKit real connection
    },
    [startCountdown]
  );

  const sendProgress = useCallback((progress: TypingProgress) => {
    setMyProgress(progress);
  }, []);

  const sendFinished = useCallback(
    (myResult: FinalResult) => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);

      const botRef = botProgressRef.current;
      const botTotalChars = passage?.length ?? 100;
      const botAccuracy =
        botRef.charIndex > 0
          ? Math.max(
              ((botRef.charIndex - botRef.errors) / botRef.charIndex) * 100,
              85
            )
          : 90;
      const botWpm = opponentProgress?.currentWpm ?? 45;

      const botResult: FinalResult & {
        displayName: string;
        isWinner: boolean;
      } = {
        playerId: "bot",
        wpm: botWpm,
        accuracy: Math.floor(botAccuracy * 10) / 10,
        errors: botRef.errors,
        charsTyped: Math.floor(botRef.charIndex),
        completionTime: 60000,
        displayName: opponent?.displayName ?? "Opponent",
        isWinner: false,
      };

      const myEntry: FinalResult & {
        displayName: string;
        isWinner: boolean;
      } = {
        ...myResult,
        displayName: myDisplayName,
        isWinner: false,
      };

      let winner: string | null = null;
      if (myResult.wpm > botWpm) {
        winner = myResult.playerId;
        myEntry.isWinner = true;
      } else if (botWpm > myResult.wpm) {
        winner = "bot";
        botResult.isWinner = true;
      } else if (myResult.accuracy > botAccuracy) {
        winner = myResult.playerId;
        myEntry.isWinner = true;
      } else if (botAccuracy > myResult.accuracy) {
        winner = "bot";
        botResult.isWinner = true;
      }

      const battleResult: BattleResult = {
        winner,
        players: {
          [myResult.playerId]: myEntry,
          bot: botResult,
        },
        margin: {
          wpmDiff: Math.abs(myResult.wpm - botWpm),
          accuracyDiff: Math.round(Math.abs(myResult.accuracy - botAccuracy) * 10) / 10,
        },
      };

      setResult(battleResult);
      setState("finished");
    },
    [passage, opponentProgress, opponent, myDisplayName]
  );

  const requestRematch = useCallback(() => {
    cleanup();
    setState("idle");
    setResult(null);
    setOpponentProgress(null);
    setMyProgress(null);
    setCountdownValue(null);
    botProgressRef.current = { charIndex: 0, errors: 0 };

    setTimeout(() => findOpponent(), 100);
  }, [cleanup, findOpponent]);

  const cancelSearch = useCallback(() => {
    cleanup();
    setState("idle");
    setSearchTime(0);
  }, [cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setState("idle");
    setRoomId(null);
    setPassage(null);
    setOpponent(null);
    setResult(null);
    setOpponentProgress(null);
    setMyProgress(null);
    setCountdownValue(null);
    setSearchTime(0);
    botProgressRef.current = { charIndex: 0, errors: 0 };
  }, [cleanup]);

  const handleServerMessage = useCallback(
    (msg: ServerMessage) => {
      switch (msg.type) {
        case "waiting":
          setState("searching");
          break;
        case "matched":
          setOpponent(msg.data.opponent);
          setPassage(msg.data.passage);
          setRoomId(msg.data.roomId);
          setState("matched");
          break;
        case "countdown":
          setState("countdown");
          setCountdownValue(msg.data.count);
          break;
        case "game_start":
          setState("playing");
          break;
        case "opponent_progress":
          setOpponentProgress(msg.data);
          break;
        case "game_over":
          setResult(msg.data);
          setState("finished");
          break;
        case "opponent_left":
          setState("disconnected");
          break;
      }
    },
    []
  );

  return {
    state,
    roomId,
    passage,
    opponent,
    myProgress,
    opponentProgress,
    result,
    countdownValue,
    searchTime,
    myDisplayName,
    findOpponent,
    sendProgress,
    sendFinished,
    requestRematch,
    cancelSearch,
    disconnect,
    handleServerMessage,
  };
}
