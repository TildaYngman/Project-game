import backgroundSpace from "../assets/stars.jpeg";
import platform from "../assets/platform2.png";
import playerSheet from "../assets/sheet.png";
import lavaPool from "../assets/spacelava.png";
import bgMusic from "url:../assets/rainbowtylenol.mp3";
import jump from "url:../assets/jump.mp3";
import impact from "url:../assets/impact.mp3";
import gameOver from "../assets/gameover.png";
import comet from "../assets/comet.png";
import red from "../assets/red.png";

let player1,
  player1Controls,
  lava,
  gameMusic,
  jumpSound,
  impactSound,
  spaceBackground,
  spaceBackground2,
  showScore,
  meteorite,
  red,
  particles,
  emitter,
  platforms,
  cam,
  shiftToStartText;

let platformCount = 0;
let difficultyVar = 1;
let gameState = false;
let playerScore = 0;
let meteorBounceY = 0.1;
let bounceSpeed = 1;
let rotation = 0;

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload() {
    //What assets does the game need
    this.load.spritesheet("space", backgroundSpace, {
      frameWidth: 500,
      frameHeight: 500,
    });
    this.load.spritesheet("mainCharacter", playerSheet, {
      frameWidth: 102,
      frameHeight: 110,
    });
    this.load.spritesheet("lava", lavaPool, {
      frameWidth: 800,
      frameHeight: 110,
    });
    this.load.audio("themeSong", bgMusic);
    this.load.audio("jump", jump);
    this.load.audio("impact", impact);
    this.load.image("gameover", gameOver);
    this.load.image("platformPng", platform);
    this.load.image("red", red);
    this.load.image("comet", comet);
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, 600, 650);

    // Build camera
    cam = this.cameras.main.setBounds(0, 0, 600, 650);

    // Platform stuff
    platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    for (let i = 0; i < 8; i++) {
      let randomX = Math.floor(Math.random() * 500) + 40;
      platforms.create(randomX, i * 80, "platformPng").setScale(1);
    }

    platforms.create(400, 120, "platformPng").setScale(1); //Starting platform
    platforms.setDepth(5);

    // PLAYER
    player1 = this.physics.add.sprite(400, 50, "mainCharacter").setScale(0.62);
    player1.setDepth(11);
    player1.setSize(80, 110, true);
    // player1.setVelocityY(600);
    player1.setCollideWorldBounds(true);
    player1.body.checkCollision.up = false; //up, left and right Make it possible for the player to jump through the platforms
    player1.body.checkCollision.left = false;
    player1.body.checkCollision.right = false;
    player1Controls = this.input.keyboard.createCursorKeys();

    // ANIMS
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("mainCharacter", {
        start: 9,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("mainCharacter", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("mainCharacter", {
        start: 10,
        end: 10,
      }),
      frameRate: 10,
      repeat: 2,
    });

    this.anims.create({
      key: "lavaBoil",
      frames: this.anims.generateFrameNumbers("lava", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "backgroundAnim",
      frames: this.anims.generateFrameNumbers("space", { start: 0, end: 4 }),
      framerate: 10,
      repeat: -1,
    });

    // Space background stuff
    spaceBackground = this.add.sprite(400, 300, "space");
    spaceBackground2 = this.add.sprite(400, 800, "space");
    spaceBackground.setDepth(2);
    spaceBackground.setScale(1.6);
    spaceBackground.anims.play("backgroundAnim", true);
    spaceBackground2.setDepth(2);
    spaceBackground2.setScale(1.6);
    spaceBackground2.anims.play("backgroundAnim", true);

    // Lava stuff
    lava = this.physics.add.staticSprite(300, 650, "lava");
    lava.anims.play("lavaBoil", true);
    lava.setScale(1.4);
    lava.setSize(1000, 120, true);
    lava.setDepth(11);

    shiftToStartText = this.add
      .text(300, 325, "PRESS SHIFT TO START", {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        color: "#FF6700",
        fontSize: "30px",
      })
      .setOrigin(0.5, 2)
      .setDepth(10);

    // Lava kills player, reset game
    this.physics.add.overlap(player1, lava, () => {
      difficultyVar = 1;
      platformCount = 0;
      rotation = 0;
      gameMusic.stop();
      impactSound.play();
      let gameOverPic = this.add
        .image(300, 325, "gameover")
        .setOrigin(0.5, 2)
        .setDepth(10)
        .setScale(0.9);

      this.add
        .text(300, 325, "Your score is: " + playerScore, {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: "#00FF00",
          fontSize: "50px",
        })
        .setOrigin(0.5)
        .setDepth(10);

      this.add
        .text(300, 325, "Click to play again", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: "#00FF00",
          fontSize: "30px",
        })
        .setOrigin(0.5, -2)
        .setDepth(10);

      this.physics.pause();
      gameState = false;
      this.anims.pauseAll();
      this.input.on("pointerup", () => {
        playerScore = 0;
        this.anims.resumeAll();
        this.scene.restart();
      });
    });

    // Audio stuff
    gameMusic = this.sound.add("themeSong", { volume: 0.2 });
    gameMusic.play();
    jumpSound = this.sound.add("jump", { volume: 0.1 });
    impactSound = this.sound.add("impact", { volume: 0.5 });

    // Colliders
    this.physics.add.collider(player1, platforms); // making a collide between the player and the platforms so the player can stand on top of the platforms

    // this.physics.world.checkCollision.bottom = true; //Checking collison between player and bottom of the world

    // METEOR
    meteorite = this.physics.add.image(400, 600, "comet").setScale(1);
    particles = this.add.particles("red");
    emitter = particles.createEmitter({
      speed: 50,
      scale: { start: 0.3, end: 0 },
      blendMode: "ADD",
    });

    emitter.startFollow(meteorite);
    meteorite.setDepth(10);
    particles.setDepth(10);

    meteorite.setVelocity(70, 50);
    meteorite.setBounce(bounceSpeed, 1);
    meteorite.setCollideWorldBounds(true);
    meteorite.setSize(40, 40, true);

    // Meteor kills player
    this.physics.add.overlap(player1, meteorite, () => {
      difficultyVar = 1;
      platformCount = 0;
      gameMusic.stop();
      impactSound.play();
      gameOverPic = this.add
        .image(300, 325, "gameover")
        .setOrigin(0.5, 2)
        .setDepth(10)
        .setScale(0.9);

      this.add
        .text(300, 325, "Your score is: " + playerScore, {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: "#00FF00",
          fontSize: "50px",
        })
        .setOrigin(0.5)
        .setDepth(10);

      this.add
        .text(300, 325, "Click to play again", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          color: "#00FF00",
          fontSize: "30px",
        })
        .setOrigin(0.5, -2)
        .setDepth(10);

      this.physics.pause();
      gameState = false;
      this.anims.pauseAll();
      this.input.on("pointerup", () => {
        playerScore = 0;
        this.anims.resumeAll();
        this.scene.restart();
      });
    });

    // Display live score
    showScore = this.add
      .text(50, 50, playerScore, {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        color: "#00FF00",
        fontSize: "45px",
      })
      .setOrigin(0.5)
      .setDepth(8);
  }

  update() {
    this.CharacterMovement();
    playerSticky();

    // Start game with SHIFT button
    if (player1Controls.shift.isDown) {
      gameState = true;
      shiftToStartText.destroy();
    }

    // While game is running, move each platform down continuously, and scroll background
    if (gameState == true) {
      platforms.children.iterate(platformScroll, this);
      backgroundScroll();
    }

    // With this function, we move the platforms lower until they're off screen and then we reposition
    // them above the screen to create an endless effect.
    function platformScroll(platform) {
      if (platform.y > 600) {
        platform.y = -platform.height;
        platform.x = Math.floor(Math.random() * 500) + 40;
        platformCount += 1;
        playerScore += 1;
        showScore.setText(playerScore);
        diffCheck();
      } else {
        platform.y += difficultyVar;
      }
    }

    // Loop background for movement effect
    function backgroundScroll() {
      if (spaceBackground.y < -250) {
        spaceBackground.y = 400;
        spaceBackground2.y = 800;
      } else {
        spaceBackground.y -= 1;
        spaceBackground2.y -= 1;
      }
    }

    // Spin the meteor :D
    meteorite.angle += rotation;
    if (rotation < 1) {
      rotation = 2;
    } else {
      rotation = rotation - 0.2;
    }

    // This function shake the camera
    function shake() {
      cam.shake(500, 0.03);
    }

    // Periodically increase difficulty through updating certain variables
    function diffCheck() {
      if (platformCount == 150) {
        meteorite.setVelocityY(-850);
        meteorite.setBounce(bounceSpeed + meteorBounceY, 1);
        rotation = 20;
        shake();
        difficultyVar = 5;
      } else if (platformCount == 100) {
        meteorite.setVelocityY(-750);
        meteorite.setBounce(bounceSpeed + meteorBounceY, 1);
        rotation = 20;
        shake();
        difficultyVar = 4;
      } else if (platformCount == 50) {
        meteorite.setVelocityY(-650);
        meteorite.setBounce(bounceSpeed + meteorBounceY, 1);
        rotation = 20;
        shake();
        difficultyVar = 3;
      } else if (platformCount == 10) {
        meteorite.setVelocityY(-550);
        meteorite.setBounce(bounceSpeed + meteorBounceY, 1);
        rotation = 20;
        shake();
        difficultyVar = 2;
      }
    }

    //Make player stick to platforms no matter how fast they go by matching platform descent (y axis)
    function playerSticky() {
      if (player1.body.onFloor()) {
        player1.y += difficultyVar;
      }
    }
  }

  //Set character movement keys
  CharacterMovement() {
    if (gameState == true) {
      if (player1Controls.left.isDown) {
        player1.setVelocityX(-500);
        player1.anims.play("run", true);
        player1.flipX = true;
      } else if (player1Controls.right.isDown) {
        player1.setVelocityX(500);
        player1.anims.play("run", true);
        player1.flipX = false;
      } else {
        player1.setVelocityX(0);
        player1.anims.play("idle", true);
      }

      if (player1Controls.space.isDown && player1.body.onFloor()) {
        player1.anims.play("jump", true);
        jumpSound.play();
        player1.setVelocityY(-750);
      }

      if (!player1.body.onFloor()) {
        player1.anims.play("jump", true);
      }
    }
  }
}
