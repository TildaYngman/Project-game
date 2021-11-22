import Phaser from 'phaser'// Phaser through node
import backgroundimage from "../assets/kitchen.jpg";
import player from "../assets/cat.png";

let background, player1, player1Controls; // add block


export default class Game extends Phaser.Scene {

preload () {
   this.load.image('background', backgroundimage);
   this.load.image('cat', player);
}

create (){
    background = this.add.image(400, 200, 'background');
    player1 = this.physics.add.sprite(400, 250, 'cat');
    player1.setScale(0.05);
    player1.setCollideWorldBounds();
    player1Controls = this.input.keyboard.createCursorKeys();


    // block = this.add.rectangle(200, 200, 100, 20, 0x000000);
    //this.tilda() //to call a function within a function, the this refers to the function.
}

update (){
    if (player1Controls.left.isDown) {
        player1.setVelocity(-500, 0);
      } else {
        player1.setVelocity(0, 0);
      }
    if (player1Controls.right.isDown) {
        player1.setVelocity(500, 0);
    }
}

//tilda(){} creating a function does not need to have function before
}