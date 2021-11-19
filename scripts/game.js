import Phaser from 'phaser'// Phaser through node
import backgroundimage from "../assets/kitchen.jpg";

let background;

export default class Game extends Phaser.Scene {

preload () {
   this.load.image('background', backgroundimage);
    let block = this.add.rectangle(200, 200, 100, 20, 0xffffff);
}

create (){
    this.add.image(400, 200, 'background');
    console.log("back", backgroundimage);

    //this.tilda() //to call a function within a function, the this refers to the function.
}

update (){

}

//tilda(){} creating a function does not need to have function before
}