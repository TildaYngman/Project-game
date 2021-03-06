import backgroundSpace from "../assets/stars.jpeg";
import Logo from "../assets/ASLogo.png";
import startTheme from "url:../assets/whogivesafuck.mp3";
import playerSheet from "../assets/sheet.png";
import keys from "../assets/keyboard.png";

export default class Title extends Phaser.Scene {
  constructor() {
    super({ key: "titleScene" });
  }

  preload() {
    this.load.spritesheet("space", backgroundSpace, {
      frameWidth: 500,
      frameHeight: 500,
    });

    this.load.spritesheet("mainCharacter", playerSheet, {
      frameWidth: 102,
      frameHeight: 110,
    });

    this.load.image("logo", Logo);

    this.load.audio("theme", startTheme);

    this.load.image("keys", keys);
  }

  create() {
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
    const player1 = this.physics.add
      .staticSprite(400, 143, "mainCharacter")
      .setScale(0.8);
    player1.setDepth(10);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("mainCharacter", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: -1,
    });
    player1.anims.play("idle", true);

    this.anims.create({
      key: "backgroundAnim",
      frames: this.anims.generateFrameNumbers("space", { start: 0, end: 4 }),
      framerate: 10,
      repeat: -1,
    });

    const spaceBackground = this.add.sprite(400, 300, "space");
    spaceBackground.setDepth(2);
    spaceBackground.setScale(1.6);
    spaceBackground.anims.play("backgroundAnim", true);
    console.log(spaceBackground.anims);

    const positions = {
      centerX: this.physics.world.bounds.width / 2,
      centerY: this.physics.world.bounds.height / 2,
      topEdge: 0,
      rightEdge: this.physics.world.bounds.width,
      bottomEdge: this.physics.world.bounds.height,
      leftEdge: 0,
    };

    const mainLogo = this.add
      .image(positions.centerX, positions.centerY, "logo")
      .setOrigin(0.5, 2)
      .setDepth(10);

    //    this.add.text(positions.centerX, positions.centerY, 'AstroCat!').setOrigin(0.5, 0.5), { fontSize: "20px"} ;

    const lore = this.add
      .text(
        45,
        300,
        "On the 18th of October in 1963 a stray Parisian cat named F??licette,\n as a part of the French space program, was successfully launched into space\n and thereby became the first (and only!) cat to reach the stars.\n Join her on her outer space odyssey, but watch out for the space lava!",
        {
          fontFamily: "Arial",
          fill: "#FFFFFF",
          fontSize: 15,
          color: "#FFFFFF",
          align: "center",
        }
      )
      .setFontStyle("italic")
      .setDepth(10);

    const startGameButton = this.add
      .text(positions.centerX, positions.centerY + 100, "Start Game!", {
        fontFamily: "Arial",
        fill: "#00ff00",
        fontSize: 50,
        color: "#00ff00",
      })
      .setOrigin(0.5);
    startGameButton.setInteractive({ useHandCursor: true });
    startGameButton.setDepth(10);

    const mainKeys = this.add
      .image(positions.centerX, positions.centerY, "keys")
      .setOrigin(0.5, -2)
      .setDepth(10)
      .setScale(0.2);

    this.input.on("pointerdown", () => {
      this.scene.stop("Title");
      this.scene.start("Game");
      // themeMusic.stop();
    });
  }
}
