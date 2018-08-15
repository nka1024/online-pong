/**
 * @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
 * @copyright    nka1024
 * @description  Pong
 * @license      nka1024
 */

import { Racket } from "../objects/racket";
import { Ball } from "../objects/ball";
import { Network } from "../network";
import { Field } from "../objects/field";
import { CONST } from "../const/const";

export class GameScene extends Phaser.Scene {

  public player1: Racket;
  public player2: Racket;
  public ball: Ball;
  public field: Field;

  public network: Network;
  public player_side: number;

  private latencyText: Phaser.GameObjects.Text;
  private youText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  create(data): void {
    this.network = data.network;
    this.player_side = data.player_side;

    this.field = new Field({ scene: this, opt: {isBot: false} });
    this.player1 = new Racket({ scene: this, opt: {player_side: 1, isOpponent: data.player_side != 1} });
    this.player2 = new Racket({ scene: this, opt: {player_side: 2, isOpponent: data.player_side != 2} });
    this.ball = new Ball({ scene: this, opt: {}
    });

    this.input.keyboard.on('keydown_' + 'A', function (event) { 
      this.network.sendTest();
    }, this);
    this.network.on("end_match", (data) => {

      console.log("ending game: " + JSON.stringify(data));
      this.network.disconnect();
      var msg = "";
      if (data.side == this.player_side) {
        msg = "YOU LOST";
      } else {
        msg = "VICTORY!";
      }
      this.scene.start("LobbyScene", {message: msg});
    });

    this.latencyText = this.add.text(
      4, 4,
      '? ms',
      { fontFamily: 'system-ui', fontSize: 10, color: '#edcf38' }
    );


    var youX: number = 0;
    var youY: number = this.sys.canvas.height/2 - CONST.FIELD_H/2 - 20;
    if (this.player_side == 1) youX = this.sys.canvas.width/2 - CONST.FIELD_W/2;
    if (this.player_side == 2) youX = this.sys.canvas.width/2 + CONST.FIELD_W/2 - 20;
    
    this.youText = this.add.text(
      youX, youY,
      'YOU',
      { fontFamily: 'system-ui', fontSize: 12, color: '#edcf38' }
    );
    
    this.add.text(
      this.sys.canvas.width/2 - CONST.FIELD_H/2 - 32, 
      this.sys.canvas.height/2 + CONST.FIELD_H/2 + 40,
      'DOWN',
      { fontFamily: 'monospace', fontSize: 32, color: '#f0f0f0' }
    );

    var leftButton = this.add.graphics({
      x: this.sys.canvas.width/2 - CONST.FIELD_W/2 + 10, 
      y: this.sys.canvas.height/2 + CONST.FIELD_H/2 + 20});
    leftButton.lineStyle(5, 0xf0f0f0, 0.5);
    leftButton.fillStyle(0x0000FF, 1.0);
    leftButton.strokeRect(0, 0, CONST.FIELD_W/2-20, CONST.FIELD_H/2);
    

    this.add.text(
      this.sys.canvas.width/2 +  CONST.FIELD_W/4 - 20, 
      this.sys.canvas.height/2 + CONST.FIELD_H/2 + 40,
      'UP',
      { fontFamily: 'monospace', fontSize: 32, color: '#f0f0f0' }
    );

    var leftButton = this.add.graphics({
      x: this.sys.canvas.width/2 + 10, 
      y: this.sys.canvas.height/2 + CONST.FIELD_H/2 + 20});
    leftButton.lineStyle(5, 0xf0f0f0, 0.5);
    leftButton.fillStyle(0x0000FF, 1.0);
    leftButton.strokeRect(0, 0, CONST.FIELD_W/2-20, CONST.FIELD_H/2);
    
  }

  update(): void {
    this.field.update();
    this.player1.update();
    this.player2.update();
    this.ball.update();

    this.latencyText.text = "" + this.network.latency + " ms"
    this.latencyText.updateText();
  }
}
