import Phaser, { Physics } from 'phaser';// Phaser through node

// import Game from './Game';
import Title from './Title';
import Game from './Game';

var config = {//What the gameboard is going to look like.
    type: Phaser.AUTO,// will choose either webGL or canvas as renderer
    width: 800, //height and width of the game board
    height: 600,
    scene:[Title, Game], // run preload, create, update
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: true // turn this to true and you will get borders and direction "hit area of object"
        }
    }
};

var game = new Phaser.Game(config);