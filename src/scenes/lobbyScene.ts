/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  Pong
* @license      nka1024
*/

import { Network } from "../network";
import { connect } from "tls";

export class LobbyScene extends Phaser.Scene {
  private network: Network;
  // private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  private statusText: Phaser.GameObjects.Text;
  private statusString: string;

  constructor() {
    super({
      key: "LobbyScene"
    });
  }


  create(data):void {
    var PONGText = this.add.text(
      this.sys.canvas.width/2 - 50, 50,
      'PONG',
      { fontFamily: 'system-ui', fontSize: 32, color: '#edcf38' }
    );

    this.statusString = data.message;
    this.statusText = this.add.text(
      30,200,
      '...waiting for second player...',
      { fontFamily: 'system-ui', fontSize: 16, color: '#edcf38' }
    );

    console.log("looking for match");
    var timer = this.time.addEvent({
      delay: 3000,// ms
      callback: () => {
        this.connect();    
      },
      callbackScope: this,
      loop: false
    });
  }

  private connect() {
    this.network = new Network();
      this.network.connect();
      this.network.sendHello(1, 1);
      this.network.on("start_match",(data)=> {
        console.log("match " + data.match_id + " started as " + data.player_side);
        this.network.match_id = data.match_id;
        this.startMatch(data.player_side);
      })
  }

  update():void {
    if (this.statusString && this.statusText.text != this.statusString) {
      this.statusText.text = this.statusString;
      this.statusText.updateText();
      this.statusText.update();
      
    }
    this.statusText.x = this.sys.canvas.width/2 - this.statusText.width/2
  }
  private startMatch(player_side: number) {
    this.scene.start("GameScene", { network: this.network, player_side: player_side });
  }
}
