import Phaser from "phaser";

import { eventLeaderboard } from "./events";
import { GAME_HEIGHT, GAME_WIDTH } from "./config";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("bg2", "assets/bg2.png");
    this.load.image("catcher", "assets/boat.png");
    this.load.image("p1", "assets/p1.png");
    this.load.image("p2", "assets/p2.png");
    this.load.image("p3", "assets/p3.png");
    this.load.image("p4", "assets/p4.png");
    this.load.image("e1", "assets/e1.png");
    this.load.image("e2", "assets/e2.png");
    this.load.image("empty", "assets/empty.png");
  }
  create() {
    const bgImage = this.add.image(0, 0, "bg2").setOrigin(0);
    bgImage.setScale(GAME_WIDTH / bgImage.width, GAME_HEIGHT / bgImage.height);

    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });
    this.timeout = 60;
    this.timeText = this.add.text(16, 48, "Time: 60", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.catcher = this.physics.add.sprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 35,
      "catcher"
    );

    this.endLine = this.physics.add.sprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT + 50,
      "empty"
    );
    this.endLine.immovable = true;
    this.endLine.setSize(GAME_WIDTH, 10);

    this.catcher.setScale(0.1);
    this.catcher.setCollideWorldBounds(true);
    this.items = this.physics.add.group();
    this.items.createMultiple({
      key: ["p1", "p2", "p3", "p4", "e1", "e2"],
      frameQuantity: 10,
      setXY: { x: 0, y: -100, stepX: GAME_WIDTH / 10 },
      setScale: { x: 0.1, y: 0.1 },
      repeat: -1,
      active: false,
    });

    Phaser.Utils.Array.Shuffle(this.items.getChildren());

    this.physics.add.collider(
      this.catcher,
      this.items,
      this.collectItem,
      null,
      this
    );

    this.physics.add.collider(
      this.endLine,
      this.items,
      this.killItem,
      null,
      this
    );

    this.time.addEvent({
      delay: 1000,
      callback: this.dropItem,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: 60000,
      callback: this.endGame,
      callbackScope: this,
    });

    this.input.keyboard.on("keydown-LEFT", () =>
      this.catcher.setVelocityX(-300)
    );
    this.input.keyboard.on("keydown-RIGHT", () =>
      this.catcher.setVelocityX(300)
    );
    this.input.keyboard.on("keyup-LEFT", () => this.catcher.setVelocityX(0));
    this.input.keyboard.on("keyup-RIGHT", () => this.catcher.setVelocityX(0));
  }

  update() {
    this.scoreText.setText("Score: " + this.score);
    this.timeText.setText("Time: " + this.timeout);
  }

  dropItem() {
    const item = this.items.getFirstDead();
    if (item) {
      item.setRandomPosition(50, 0, GAME_WIDTH - 100, 0);
      item.setVelocityY(150).setVelocityX(0);
      item.setActive(true).setVisible(true);
    }
    this.timeout -= 1;
  }

  killItem(endLine, item) {
    endLine.body.immovable = true;
    endLine.setVelocityY(0);
    item.setActive(false).setVisible(false);
    Phaser.Utils.Array.Shuffle(this.items.getChildren());
  }

  collectItem(_, item) {
    if (!item.active) {
      return;
    }
    if (item.texture.key.startsWith("p")) {
      this.score += 50;
    } else {
      this.score += 100;
    }
    item.setActive(false).setVisible(false);
    Phaser.Utils.Array.Shuffle(this.items.getChildren());
  }

  endGame() {
    const playerName = prompt("Game Over! Enter your name:");
    fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({ name: playerName, score: this.score }),
      headers: { "Content-Type": "application/json" },
    });
    alert("Your score: " + this.score);
    eventLeaderboard.emit("leaderboardClick");
  }
}
