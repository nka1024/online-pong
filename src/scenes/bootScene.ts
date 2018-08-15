/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  Pong
* @license      nka1024
*/

export class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }

  update(): void {
    console.log("BootScene complete");
    this.scene.start("LobbyScene");
  }
}
