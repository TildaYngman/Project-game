import Phaser from 'phaser'// Phaser through node
import backgroundimage from "../assets/kitchen.jpg";
import player from "../assets/cat.png";
import platform from "../assets/platform2.png";

let background, player1, player1Controls, platforms; 

export default class Game extends Phaser.Scene {

preload () {
    //What assets does the game need
   this.load.image('background', backgroundimage);
   this.load.image('cat', player);
   this.load.image('platformPng', platform);
}


create () {
    background = this.add.image(400, 200, 'background');
    
    this.createPlatforms ()

    player1 = this.physics.add.sprite(400, 250, 'cat');
    player1.setScale(0.05);
    player1.setVelocityY(600);
    player1.setCollideWorldBounds();
    player1.body.checkCollision.up = false; //up, left and right Make it possible for the player to jump through the platforms
    player1.body.checkCollision.left = false;
    player1.body.checkCollision.right = false;
    this.physics.add.collider(player1, platforms);// making a collide between the player and the platforms so the player can stand on top of the platforms
    player1Controls = this.input.keyboard.createCursorKeys();

    this.physics.world.checkCollision.bottom = true; //Checking collison between player and bottom of the world (enable jump)

}

update () {

  this.CharacterMovement()

}

CharacterMovement () {
  player1.setVelocityX(0);
  if (player1Controls.left.isDown) {
    player1.setVelocityX(-500);
  }
  if (player1Controls.right.isDown) {
    player1.setVelocityX(500);
  }
  if (player1Controls.space.isDown && player1.body.onFloor()) {
    player1.setVelocityY(-350);
    // console.log("space is pressed")
   }
}

createPlatforms () {
  platforms = this.physics.add.group( {
    allowGravity: false, //
    immovable: true, //
  });//Make a group of the platforms, duplicate and add physics
  
  for (let i = 0; i < 8; i++) { //Forloop to create 8 random platforms
    let randomX = Math.floor(Math.random() * 800) + 24;
    platforms.create(randomX, i * 80, 'platformPng');
  }
}

}