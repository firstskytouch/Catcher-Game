class CatchGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "CatchGameScene" });
  }

  preload() {
    this.load.image("bg", "./assets/bg2.png");
    this.load.image("catcher", "./assets/boat.png");
    this.load.image("p1", "./assets/p1.png");
    this.load.image("p2", "./assets/p2.png");
    this.load.image("p3", "./assets/p3.png");
    this.load.image("p4", "./assets/p4.png");
    this.load.image("e1", "./assets/e1.png");
    this.load.image("e2", "./assets/e2.png");
  }
  create() {
    this.bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.catcher = this.physics.add.sprite(
      gameConfig.width / 2,
      gameConfig.height - 50,
      "catcher"
    );
    this.catcher.setScale(0.1);
    this.catcher.setCollideWorldBounds(true);
    this.items = this.physics.add.group();
    this.items.createMultiple({
      key: ["p1", "p2", "p3", "p4", "e1", "e2"],
      frameQuantity: 10,
      setXY: { x: 0, y: -100, stepX: gameConfig.width / 10 },
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
  }

  dropItem() {
    const item = this.items.getFirstDead();
    if (item) {
      item.setRandomPosition(50, 0, gameConfig.width-100, 0);
      item.setVelocityY(150).setVelocityX(0);
      item.setActive(true).setVisible(true);
    }
  }

  collectItem(catcher, item) {
    item.setActive(false).setVisible(false);
    if (item.texture.key.startsWith("p")) {
      this.score += 50;
    } else {
      this.score -= 100;
    }
  }

  endGame() {
    const playerName = prompt("Game Over! Enter your name:");
    // Use an API to send the score and player name to the server for leaderboard update
    fetch('/api/scores', { method: 'POST', body: JSON.stringify({ name: playerName, score: this.score }), headers: { 'Content-Type': 'application/json' } });
    alert("Your score: " + this.score);
    // Redirect to leaderboard page
    // Example: window.location.href = '/leaderboard';
  }
}

const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: CatchGameScene,
  physics: {
    default: "arcade", // Choose the physics system you want to use (e.g., 'arcade', 'matter', 'impact', etc.)
    arcade: {
      // gravity: { y: 1 }, // Customize physics settings if needed
      // ...
    },
  },
  input: {
    keyboard: true, // Enable keyboard input
  },
};

const game = new Phaser.Game(gameConfig);
