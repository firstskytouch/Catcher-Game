import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Phaser from "phaser";

import StartScene from "../game/StartScene";
import GameScene from "../game/GameScene";
import { GAME_WIDTH, GAME_HEIGHT } from "../game/config";
import { eventLeaderboard } from "../game/events";

export default function Game() {
  const navigate = useNavigate();

  useEffect(() => {
    eventLeaderboard.on("leaderboardClick", () => navigate("/leaderboard"));
    return () => eventLeaderboard.off("leaderboardClick");
  }, [navigate]);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      scene: [StartScene, GameScene],
      scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
        },
      },
      input: {
        keyboard: true,
      },
    };
    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true);
    };
  }, []);
  return <div id="game-container" />;
}
