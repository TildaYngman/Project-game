import Phaser, { Physics } from 'phaser';// Phaser through node

// import Game from './Game';
import Title from './title.js';
import Game from './game.js';
import GameOver from './GameOver.js';
// import GameOver from './GameOver.js';

var config = {//What the gameboard is going to look like.
    type: Phaser.AUTO,// will choose either webGL or canvas as renderer
    width: 600, //height and width of the game board
    height: 650,
    scene:[Title, Game, GameOver], // run preload, create, update
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false // turn this to true and you will get borders and direction "hit area of object"
        }
    }
};

var Game = new Phaser.Game(config);