const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartScene, GameScene, LeaderboardScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  input: {
    keyboard: true, // Enable keyboard input
  },
};

const game = new Phaser.Game(gameConfig);
