// import backgroundimage from "../assets/kitchen.jpg";
import backgroundSpace from '../assets/stars.jpeg';
import player from "../assets/cat.png";
import platform from "../assets/platform2.png";
import playerSheet from "../assets/sheet.png";
import lavaPool from "../assets/lava.png";
import bgMusic from "url:../assets/rainbowtylenol.mp3";
import jump from "url:../assets/jump.mp3";
import impact from "url:../assets/impact.mp3"
import gameOver from "../assets/gameover.png";

let background, player1, player1Controls, lava, spaceSound,
jumpSound, impactSound, spaceBackground, spaceBackground2, gameOver; 


// let game;
let platforms;  // a group of platform objects the player will jump on
let player; // the actual player controlled sprite
// let cursors;
let platformCount = 0;
let difficultyVar = 1;
// let emitter;
let gameState = false;
// let particles;
let playerScore = 0;
let shook = false;
let cam;
// let gameOptions = {
//   width: 800,
//   height: 600,
//   gravity: 800
// }


export default class Game extends Phaser.Scene {

constructor() {
    super({key: 'Game'});
}

preload () {
    //What assets does the game need
  this.load.spritesheet('space', backgroundSpace, {
    frameWidth: 500,
    frameHeight: 500
  });

  //  this.load.image('background', backgroundimage);
   this.load.image('cat', player);
   this.load.image('platformPng', platform);
   this.load.spritesheet('mainCharacter', playerSheet, { frameWidth: 102, frameHeight: 110});
   this.load.spritesheet('lava', lavaPool, {frameWidth: 800, frameHeight: 110} );
   this.load.audio("space", bgMusic);
   this.load.audio("jump", jump);
   this.load.audio("impact", impact);
   this.load.image('gameover', gameOver);
}

create () {
  cam = this.cameras.main.setBounds(0, 0, 600, 650);

    this.anims.create({
      key: 'backgroundAnim',
      frames:this.anims.generateFrameNumbers('space', { start: 0, end: 4}),
      framerate: 10,
      repeat: -1
    });
        
    spaceBackground = this.add.sprite(400, 300, 'space');
    spaceBackground2 = this.add.sprite(400, 800, 'space');
    spaceBackground.setDepth(2);
    spaceBackground.setScale(1.6);
    spaceBackground.anims.play('backgroundAnim', true);
    spaceBackground2.setDepth(2);
    spaceBackground2.setScale(1.6);
    spaceBackground2.anims.play('backgroundAnim', true);
  
    // background = this.add.image(400, 200, 'background');

    background = this.add.image(400, 200, 'background');
    
    // this.createPlatforms ()
    this.physics.world.setBounds(0, 0, 600, 650);

    platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    

    for (let i = 0; i < 8; i++) {
      let randomX = Math.floor(Math.random() * 500) + 40;
      platforms.create(randomX, i * 80, 'platformPng').setScale(1);
    };
    
    platforms.create(400, 120, 'platformPng').setScale(1);
    platforms.setDepth(10);

    player1 = this.physics.add.sprite(400, 50, 'mainCharacter').setScale(.8);
    player1.setDepth(10);

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('mainCharacter', { start: 9, end: 12 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('mainCharacter', { start: 0, end: 7 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('mainCharacter', { start: 10, end: 10 }),
      frameRate: 10,
      repeat: 2
    })

    lava = this.physics.add.staticSprite(300, 620, 'lava');
    this.anims.create({
      key: 'lavaBoil',
      frames: this.anims.generateFrameNumbers('lava', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    lava.anims.play('lavaBoil', true);
    lava.setSize(800, 60, true);
    lava.setDepth(10);

    // Lava kills player, reset game
    this.physics.add.overlap(player1, lava, () => {
      difficultyVar = 1;
      platformCount = 0;
      playerScore = 0;
      spaceSound.stop();
      impactSound.play();
      gameOver = this.add.image(400, 300, 'gameover').setOrigin(0.5, 2).setDepth(10);
      this.add.text(400, 300, 'Your score is: ' + playerScore, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00ff00', fontSize:'50px' }).setOrigin(0.5).setDepth(10);
      this.add.text(400, 300, 'Click to play again', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00ff00', fontSize:'30px' }).setOrigin(0.5, -2).setDepth(10);
      this.physics.pause();
      gameState = false;
      this.anims.pauseAll();
      this.input.on('pointerup', () => {
        playerScore = 0;
        this.anims.resumeAll();
        this.scene.restart();
      })
    });

    // Add the audio files
    
    // this.sound = this.sound.add("space", { volume: 0.2 });
    // this.sound.play();

    spaceSound = this.sound.add('space', { volume: 0.2 });
    spaceSound.play();
  
    jumpSound = this.sound.add("jump", { volume: 0.1 });
    impactSound = this.sound.add("impact", { volume: 0.5 });

    // player1 = this.physics.add.sprite(400, 250, 'catIdle');
    
    // player1.setScale(0.05);
    player1.setVelocityY(600);
    player1.setCollideWorldBounds(true);
    player1.body.checkCollision.up = false; //up, left and right Make it possible for the player to jump through the platforms
    player1.body.checkCollision.left = false;
    player1.body.checkCollision.right = false;

    this.physics.add.collider(player1, platforms);// making a collide between the player and the platforms so the player can stand on top of the platforms
    player1Controls = this.input.keyboard.createCursorKeys();

    this.physics.world.checkCollision.bottom = true; //Checking collison between player and bottom of the world (enable jump)
}

update () {

  this.CharacterMovement();
  playerSticky();

  if (player1Controls.shift.isDown) {
    gameState = true;
  };

  

  // While game is running, move each platform down continuously
  if (gameState == true) {
    platforms.children.iterate(updateY, this);
    bgCheck();
  };

  // With this function, we move the platforms lower until they're off screen and then we reposition
  // them above the screen to create an endless effect.
  function updateY(platform){
    if (platform.y > 600){
      platform.y = -platform.height;
      platform.x = Math.floor(Math.random() * 500) + 40;
      platformCount += 1;
      playerScore +=1;
      diffCheck();
    } else { 
      platform.y += difficultyVar;
    }
  }

  function bgCheck (){
    if (spaceBackground.y < -400) {
      spaceBackground.y = 400;
      spaceBackground2.y = 800;
    } else {
      spaceBackground.y -= 1;
      spaceBackground2.y -= 1;
    }
  }

  function shake(){
    cam.shake(500, .03);
}

  function diffCheck (){
    if (platformCount == 150) {
      shake();
      difficultyVar = 5;
    } else if (platformCount == 100) {
      shake();
      difficultyVar = 4;
    } else if(platformCount == 50){
      shake();
      difficultyVar = 3;
    } else if (platformCount == 10) {
      shake();
      difficultyVar = 2;
    }
  }

  //Make player stick to platforms no matter how fast they go by matching platform descent (y axis)
  function playerSticky() {
    if (player1.body.onFloor()){
      player1.y += difficultyVar;
    }
  }

}


  CharacterMovement () {
    player1.setVelocityX(0);
    if (gameState == true) {
      if (player1Controls.left.isDown) {
        player1.setVelocityX(-500);
        player1.anims.play('run', true);
        player1.flipX = true;
      } else if (player1Controls.right.isDown) {
        player1.setVelocityX(500);
        player1.anims.play('run', true);
        player1.flipX = false;
      }  else {
        player1.setVelocityX(0);
        player1.anims.play('idle', true);
      }

      if (player1Controls.space.isDown && player1.body.onFloor()) {
        console.log(playerScore);
        player1.anims.play('jump', true);
        jumpSound.play();
        player1.setVelocityY(-750);
      }

      if (!player1.body.onFloor()) {
        player1.anims.play('jump', true);
      }
    }
  }
}