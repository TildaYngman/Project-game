import backgroundimage from "../assets/kitchen.jpg";
import player from "../assets/cat.png";
import platform from "../assets/platform2.png";
import playerSheet from "../assets/sheet.png";
import lavaPool from "../assets/lava.png";
import gameOver from "../assets/gameover.png";

let background, player1, player1Controls, lava, gameOver; 

// let game;
let platforms;  // a group of platform objects the player will jump on
let player; // the actual player controlled sprite
// let cursors;
let platformCount = 0;
// let emitter;
let gameState = false;
// let particles;
let playerScore = 0;
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
   this.load.image('background', backgroundimage);
   this.load.image('cat', player);
   this.load.image('platformPng', platform);
   this.load.spritesheet('mainCharacter', playerSheet, { frameWidth: 102, frameHeight: 110});
   this.load.spritesheet('lava', lavaPool, {frameWidth: 800, frameHeight: 110} );
   this.load.image('gameover', gameOver);
}


create () {

    background = this.add.image(400, 200, 'background');
    
    // this.createPlatforms ()
    this.physics.world.setBounds(0, 0, 800, 600);
    platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    for (let i = 0; i < 8; i++) {
      let randomX = Math.floor(Math.random() * 740) + 24;
      platforms.create(randomX, i * 80, 'platformPng').setScale(1);
    };
    
    platforms.create(400, 120, 'platformPng').setScale(1);

    player1 = this.physics.add.sprite(400, 50, 'mainCharacter').setScale(.8);

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
      frameRate: 5,
      repeat: -1
    })

    lava = this.physics.add.staticSprite(400, 550, 'lava');
    this.anims.create({
      key: 'lavaBoil',
      frames: this.anims.generateFrameNumbers('lava', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    lava.anims.play('lavaBoil', true);
    lava.setSize(800, 60, true);

    this.physics.add.overlap(player1, lava, () => {
      gameOver = this.add.image(400, 300, 'gameover').setOrigin(0.5, 2);
      this.add.text(400, 300, 'Your score is:', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', color: '#00ff00', fontSize:'50px' }).setOrigin(0.5);
      this.physics.pause();
      gameState = false;
      this.anims.pauseAll();
      this.input.on('pointerup', () => {
        this.anims.resumeAll();
        this.scene.restart();
      })
    });

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
  // player1.anims.play('idle', true);
  
  if (player1Controls.space.isDown) {
    gameState = true;
  };

  // While game is running, move each platform down continuously
  if (gameState == true) {
    platforms.children.iterate(updateY, this);
  };

  // With this function, we move the platforms lower until they're off screen and then we reposition
  // them above the screen to create an endless effect.
  function updateY(platform){
    // let delta = Math.floor(gameOptions.height/2) - player.y;  // we want to keep the player somewhere in the center of the screen so we'll measure the difference from the center y

    // if(delta > 0){ 
    //   platform.y += delta/30; //the delta may be too large so I'll make it smaller by dividing it by 30
    // }

    if (platform.y > 600){
      platform.y = -platform.height;
      platform.x = Math.floor(Math.random() * 740) + 24;
      platformCount += 1;
      playerScore +=1;
    } else { 
      platform.y += 2;
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
    } else if ((!player1.body.onFloor())){
      player1.anims.play('jump', true);
    } else {
      player1.setVelocityX(0);
      player1.anims.play('idle', true);
    }

    if (player1Controls.space.isDown && player1.body.onFloor()) {
      console.log(playerScore);
      player1.anims.play('jump', true);
      player1.setVelocityY(-350);
      // console.log("space is pressed")
    }
    
    //  if (player1.body.touching.down){
    //   player1.anims.play('jump', true);
    // }
  }
}



// createPlatforms () {
//   platforms = this.physics.add.group( {
//     allowGravity: false, //
//     immovable: true, //
//   });//Make a group of the platforms, duplicate and add physics
  
//   for (let i = 0; i < 8; i++) { //Forloop to create 8 random platforms
//     let randomX = Math.floor(Math.random() * 800) + 24;
//     platforms.create(randomX, i * 80, 'platformPng');
//   }
// }

}