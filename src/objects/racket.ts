/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  Pong
* @license      nka1024
*/

import { CONST } from "../const/const";
import { GameScene } from "../scenes/gameScene";
import { Ball } from "./ball";

export class Racket extends Phaser.GameObjects.Graphics {
  private cursors: any;
  private gameScene: GameScene;
  private isOpponent: boolean;
  private playerSide: number;

  private speed: number = 0;

  // Controls
  private inputUp: boolean;
  private inputDown: boolean;
  private inputMouseUp: boolean;
  private inputMouseDown: boolean;

  // Collision
  public rect: Phaser.Geom.Rectangle;

  // 
  private top: number;

  constructor(params) {
    super(params.scene, params.opt);

    this.y = -1000;
    this.gameScene = params.scene;

    this.isOpponent = params.opt.isOpponent;
    this.playerSide = params.opt.player_side;
    
    if (!this.isOpponent)
      console.log("playerSide: " + this.playerSide);// + "isOpponent: " + this.isOpponent);

    this.placeRackets();
    this.gameScene.add.existing(this);

    this.cursors = this.gameScene.input.keyboard.createCursorKeys();

    this.drawRacket();
    this.rect = new Phaser.Geom.Rectangle(this.x, this.y, CONST.RACKET_W + CONST.RACKET_PHYSIC_W, CONST.RACKET_H);

    this.gameScene.input.on('pointerdown', function (pointer) {
      this.inputMouseUp = false;
      this.inputMouseDown = false;
      if (pointer.position.x > this.gameScene.sys.canvas.width / 2) {
        this.inputMouseUp = true;
      } else {
        this.inputMouseDown = true;
      }
    }, this);

    this.gameScene.input.on('pointerup', function (pointer) {
      this.inputMouseUp = false;
      this.inputMouseDown = false;
    }, this);

    if (this.isOpponent) {
      this.gameScene.network.on("opponent_update", (data) => {
        this.y = this.top + data.pos.y;
        this.speed = data.speed;
      });
    }
    else {
      var timer = this.gameScene.time.addEvent({
        delay: 300,// ms
        callback: () => {
          var speed = this.inputDown || this.inputUp ? this.speed : 0;
          this.gameScene.network.sendPlayerUpdate(this.playerSide, this.y - this.top, speed);
        },
        callbackScope: this,
        loop: true
      });
    }
  }

  private drawRacket(): void {
    this.fillStyle(0xfffffA);
    this.fillRect(0, 0, CONST.RACKET_W, CONST.RACKET_H);
  }

  private handlePlayerInput(): void {
    this.inputDown = this.cursors.down.isDown || this.inputMouseDown;
    this.inputUp = this.cursors.up.isDown || this.inputMouseUp;
  }

  private handleBotInput(): void {
    let ball: Ball = this.gameScene.ball;
    this.inputUp = ball.y < this.y;
    this.inputDown = ball.y > this.y + CONST.RACKET_H;
  }

  private handleMovement(): void {
    if (!this.isOpponent) {
      if (this.inputUp) {
        this.speed -= CONST.RACKET_ACCEL;
      } else if (this.inputDown) {
        this.speed += CONST.RACKET_ACCEL;
      } else {
        this.speed *= CONST.RACKET_DECEL;
        if (Math.abs(this.speed) < 0.2) {
          this.speed = 0;
        }
      }
    }

    this.speed = Phaser.Math.Clamp(this.speed, -CONST.RACKET_SPEED, CONST.RACKET_SPEED);
    this.y += this.speed;
  }

  update(): void {
    if (this.isOpponent) {
      // this.handleBotInput();

    } else {
      this.handlePlayerInput();
    }

    this.handleMovement();

    if (this.playerSide == 1)
      this.rect.x = this.x - CONST.RACKET_PHYSIC_W;
    else 
      this.rect.x = this.x;
    this.rect.y = this.y;

    this.placeRackets();
  }

  private placeRackets(): void {
    this.top = this.gameScene.sys.canvas.height / 2 - CONST.FIELD_H / 2;
    var left: number = this.gameScene.sys.canvas.width / 2 - CONST.FIELD_W / 2;
    var right: number = this.gameScene.sys.canvas.width / 2 + CONST.FIELD_W / 2;
    var bottom: number = this.gameScene.sys.canvas.height / 2 + CONST.FIELD_H / 2;

    this.x = this.playerSide == 2  ? right - 6 : left + 2;
    if (this.y == -1000) {
      this.y = this.gameScene.sys.canvas.height / 2 - CONST.RACKET_H / 2;
    } else {
      this.y = Phaser.Math.Clamp(this.y, this.top, bottom - CONST.RACKET_H);
    }
  }
}