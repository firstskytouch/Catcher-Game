class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("bg1", "./assets/bg1.png");
  }

  create() {
    // Add background, title, and start button
    const bgImage = this.add.image(0, 0, "bg1").setOrigin(0);
    bgImage.setScale(
      gameConfig.width / bgImage.width,
      gameConfig.height / bgImage.height
    );

    this.add
      .text(gameConfig.width / 2, 100, "Catch Game", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);
    const startButton = this.add
      .text(gameConfig.width / 2, 400, "Start", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);
    startButton.setInteractive();
    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    const leaderboardButton = this.add
      .text(gameConfig.width / 2, 500, "Leaderboard", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);
    leaderboardButton.setInteractive();
    leaderboardButton.on("pointerdown", () => {
      this.scene.start("LeaderboardScene");
    });
  }
}
