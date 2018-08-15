/**
 * @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
 * @copyright    nka1024
 * @description  Blank
 * @license      nka1024
 */

/// <reference path="./phaser.d.ts"/>

import "phaser";

import { BootScene } from "./scenes/bootScene";
import { LobbyScene } from "./scenes/lobbyScene";
import { GameScene } from "./scenes/gameScene";

const config: GameConfig = {
  title: "Pong",
  url: "https://github.com/nka1024",
  version: "1.0",
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, LobbyScene, GameScene],
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false
  },
  physics: null,
  disableContextMenu: true,
  backgroundColor: "#020202",
  pixelArt: false,
  antialias: false
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
 
var game = null;

document.ontouchmove = function(event){
  event.preventDefault();
}

window.addEventListener('resize', () => {
  resize(window.innerWidth, window.innerHeight);
}, false);

window.onload = () => {
  game = new Game(config);
  resize(window.innerWidth, window.innerHeight);
};

function create() {
  this.events.on('resize', this.parent.resize, this);
}

function resize(width, height) {
  game.resize(width, height);
}
