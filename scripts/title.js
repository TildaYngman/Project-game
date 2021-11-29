

let positions;

export default class Title extends Phaser.Scene {

    constructor() {
        super({key: 'titleScene'});
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

       this.add.text(positions.centerX, positions.centerY, 'AstroCat!').setOrigin(0.5, 0.5), { fontSize: "20px"} ;

        const startGameButton = this.add.text(positions.centerX, positions.centerY + 100, 'Start Game!', { fill: '#FFFFFF', fontSize: 50, color: "#FFFFFF", }).setOrigin(0.5);
        startGameButton.setInteractive({ useHandCursor: true });

        this.input.on('pointerdown', () => {
            this.scene.stop('Title')
            this.scene.start('Game')
        })

        // startGameButton.on('pointerup', () => { this.scene.start('Game'); }); 
    }

}