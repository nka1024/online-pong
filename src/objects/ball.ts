/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  Pong
* @license      nka1024
*/

import { CONST } from "../const/const"
import { GameScene } from "../scenes/gameScene";
import { Racket } from "../objects/racket"
import { Network } from "../network";

export class Ball extends Phaser.GameObjects.Graphics {

  private speed_x: number = 1;
  private speed_y: number = 1;
  private gameScene: GameScene;
  private rect: Phaser.Geom.Rectangle;

  private top: number = 0;
  private left: number = 0;

  constructor(params) {
    super(params.scene, params.opt);
    this.gameScene = params.scene;
    this.gameScene.add.existing(this);

    this.x = this.gameScene.sys.canvas.width / 2 - CONST.BALL_SIZE / 2;
    this.y = this.gameScene.sys.canvas.height / 2 - CONST.BALL_SIZE / 2;
    
    this.rect = new Phaser.Geom.Rectangle(this.x, this.y, CONST.BALL_SIZE, CONST.BALL_SIZE);
    this.drawBall();

    this.gameScene.network.on("ball_update", (event) => {
      this.x = this.left + event.pos.x;
      this.y = this.top + event.pos.y;
  
      this.speed_x = event.speed.x;
      this.speed_y = event.speed.y;
    });
  }

  private drawBall(): void {
    this.fillStyle(0xffffff);
    this.fillRect(0, 0, CONST.BALL_SIZE, CONST.BALL_SIZE);
  }

  update(): void {
    this.x += this.speed_x;
    this.y += this.speed_y;

    this.rect.x = this.x;
    this.rect.y = this.y;

    this.top = this.gameScene.sys.canvas.height / 2 - CONST.FIELD_H / 2;
    this.left = this.gameScene.sys.canvas.width / 2 - CONST.FIELD_W / 2;
    var right: number = this.gameScene.sys.canvas.width / 2 + CONST.FIELD_W / 2;
    var bottom: number = this.gameScene.sys.canvas.height / 2 + CONST.FIELD_H / 2;

    if (this.x <= this.left || this.x + CONST.BALL_SIZE >= right) {
      // console.log("GAME OVER");
    }

    if (this.y <= this.top || this.y + CONST.BALL_SIZE >= bottom) {
      this.speed_y = -this.speed_y;
    }

    if (this.x < this.left || this.x > right) {
      var sideOut = this.x < this.left ? 1 : 2;
      if (this.gameScene.player_side == sideOut) {
        this.gameScene.network.sendBallOut(sideOut);
      }
    }

    if (this.collides(this.gameScene.player1) || this.collides(this.gameScene.player2)) {
      var legitLeft = this.speed_x < 0 && this.gameScene.player_side == 1;
      var legitRight = this.speed_x > 0 && this.gameScene.player_side == 2;

      if (legitLeft || legitRight) {
        this.speed_x = Math.sign(-this.speed_x) * (Math.abs(this.speed_x) + 0.1);
        this.speed_y = Math.random() * 2
        this.gameScene.network.sendBallUpdate(this.x - this.left, this.y - this.top, this.speed_x, this.speed_y);
      } else {
        this.speed_x = 0;
        this.speed_y = 0;
      }
    };
  }

  private collides(racket: Racket): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(this.rect, racket.rect);
  }

}