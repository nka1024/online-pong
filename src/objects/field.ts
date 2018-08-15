/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  Pong
* @license      nka1024
*/

import { CONST } from "../const/const";
import { GameScene } from "../scenes/gameScene";

export class Field extends Phaser.GameObjects.Graphics {

    private currentScene: GameScene;

    constructor(params) {
        super(params.scene, params.opt);
        this.currentScene = params.scene

        this.currentScene.add.existing(this);
        this.drawField();
    }

    private drawField():void {
        var top: number = this.currentScene.sys.canvas.height / 2 - CONST.FIELD_H / 2;
        var left: number = this.currentScene.sys.canvas.width / 2 - CONST.FIELD_W / 2;

        this.fillStyle(0x101010);
        this.fillRect(left, top, CONST.FIELD_W, CONST.FIELD_H);

        this.lineStyle(1, 0xaaaaaa);
        this.strokeRect(left, top, CONST.FIELD_W, CONST.FIELD_H);
        
        this.strokeRect(this.currentScene.sys.canvas.width / 2, top, 2, CONST.FIELD_H);
    }

}