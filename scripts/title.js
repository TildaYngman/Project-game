import backgroundSpace from '../assets/stars.jpeg';
import Logo from "../assets/ASLogo.png";
import startTheme from "url:../assets/whogivesafuck.mp3";

let positions, Logo, themeMusic;
let spaceBackground;


export default class Title extends Phaser.Scene {

    constructor() {
        super({key: 'titleScene'});
    }

    preload(){
        this.load.spritesheet('space', backgroundSpace, {
            frameWidth: 500,
            frameHeight: 500
          });

        this.load.image('logo', Logo);

        this.load.audio("theme", startTheme);
    }

    create(){
        // themeMusic = this.sound.add('theme', { volume: 0.2 });
        // if (!this.sound.locked){
        //         // already unlocked so play
        //         themeMusic.play();
        //     }else{
        //         // wait for 'unlocked' to fire and then play
        //         this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        //             themeMusic.play();
        //         })
        // }
        
        

        this.anims.create({
            key: 'backgroundAnim',
            frames:this.anims.generateFrameNumbers('space', { start: 0, end: 4}),
            framerate: 10,
            repeat: -1
          });
        
        spaceBackground = this.add.sprite(400, 300, 'space');
        spaceBackground.setDepth(2);
        spaceBackground.setScale(1.6);
        spaceBackground.anims.play('backgroundAnim', true);
        console.log(spaceBackground.anims)

        positions = {
            centerX: this.physics.world.bounds.width / 2,
            centerY: this.physics.world.bounds.height / 2,
            topEdge: 0,
            rightEdge: this.physics.world.bounds.width,
            bottomEdge: this.physics.world.bounds.height,
            leftEdge: 0,
        };

        Logo = this.add.image(positions.centerX, positions.centerY, 'logo').setOrigin(0.5, 2).setDepth(10); 

    //    this.add.text(positions.centerX, positions.centerY, 'AstroCat!').setOrigin(0.5, 0.5), { fontSize: "20px"} ;


        const startGameButton = this.add.text(positions.centerX, positions.centerY + 100, 'Start Game!', { fill: '#FFFFFF', fontSize: 50, color: "#FFFFFF", }).setOrigin(0.5);
        startGameButton.setInteractive({ useHandCursor: true })
        startGameButton.setDepth(10);
        
        

        this.input.on('pointerdown', () => {
            this.scene.stop('Title')
            this.scene.start('Game')
            // themeMusic.stop();
        })

        

    }
    
}