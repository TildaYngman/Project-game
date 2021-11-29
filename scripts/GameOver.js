let positions;

export default class Title extends Phaser.Scene {

    constructor() {
        super({key: 'GameOver'});
    }

    preload(){

    }

    create(){

        positions = {
            centerX: this.physics.world.bounds.width / 2,
            centerY: this.physics.world.bounds.height / 2,
            topEdge: 0,
            rightEdge: this.physics.world.bounds.width,
            bottomEdge: this.physics.world.bounds.height,
            leftEdge: 0,
          };

       this.add.text(positions.centerX, positions.centerY, 'GameOver!').setOrigin(0.5, 0.5), { fontSize: "20px"} ;

    }

}