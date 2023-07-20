class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: "LeaderboardScene" });
  }

  preload() {
    this.load.image("bg2", "./assets/bg2.png");
  }

  create() {
    const bgImage = this.add.image(0, 0, "bg2").setOrigin(0);
    bgImage.setScale(gameConfig.width / bgImage.width, gameConfig.height / bgImage.height);
  }
}
